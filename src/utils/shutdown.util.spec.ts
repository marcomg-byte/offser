import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  MockInstance,
} from 'vitest';
import http from 'http';
import https from 'https';
import { gracefulShutdown } from './shutdown.util.js';
import { logger, extractErrorInfo } from './index.js';
import { createCloseMock, createMockServer } from '../__mocks__/index.js';

vi.mock('./index.js');

describe('gracefulShutdown', () => {
  let closeMock: ReturnType<typeof vi.fn>;

  let mockServer: http.Server | https.Server;

  let processExitSpy: MockInstance;
  let setTimeoutSpy: MockInstance;

  beforeEach(() => {
    closeMock = vi.fn();
    vi.clearAllMocks();
    mockServer = createMockServer(closeMock) as http.Server;
    processExitSpy = vi
      .spyOn(process, 'exit')
      .mockImplementation(() => undefined as never);
    setTimeoutSpy = vi.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should log shutdown signal and start graceful shutdown', () => {
    gracefulShutdown(mockServer, 'SIGTERM');

    expect(logger.info).toHaveBeenCalledWith(
      '❗ SIGTERM received, starting graceful shutdown...',
    );
    expect(closeMock).toHaveBeenCalledTimes(1);
  });

  it('should close server successfully and exit with code 0', () => {
    const flushSpy = vi.spyOn(logger, 'flush');
    const errorCloseMock = createCloseMock(mockServer);
    mockServer.close = errorCloseMock;
    gracefulShutdown(mockServer, 'SIGINT');

    expect(logger.info).toHaveBeenCalledWith('⏹️  Server closed gracefully');
    expect(flushSpy).toHaveBeenCalled();
    expect(processExitSpy).toHaveBeenCalledWith(0);
  });

  it('should handle server close error and exit with code 1', () => {
    const testError = new Error('Server close error');
    const errorCloseMock = createCloseMock(mockServer, testError);
    mockServer.close = errorCloseMock;

    gracefulShutdown(mockServer, 'SIGTERM');

    expect(extractErrorInfo).toHaveBeenCalledWith(testError);
    expect(logger.error).toHaveBeenCalledWith(
      {
        errorInfo: {
          cause: undefined,
          message: 'Server close error',
          name: 'Error',
          stack: expect.stringContaining('Error: Server close error') as string,
        },
      },
      'Error during server shutdown',
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should set a timeout for forced shutdown', () => {
    gracefulShutdown(mockServer, 'SIGTERM');
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 30000);
  });

  it('should force exit if shutdown timeout is exceeded', () => {
    vi.useFakeTimers();
    gracefulShutdown(mockServer, 'SIGTERM');
    vi.advanceTimersByTime(30000);

    expect(logger.error).toHaveBeenCalledWith(
      '⏰ Shutdown timeout exceeded, forcing exit',
    );
    expect(processExitSpy).toHaveBeenCalledWith(1);
    vi.useRealTimers();
  });

  it('should work with https.Server instance', () => {
    const httpsCloseMock = createCloseMock(mockServer);
    const httpsServer = createMockServer(httpsCloseMock) as https.Server;

    gracefulShutdown(httpsServer, 'SIGINT');
    expect(logger.info).toHaveBeenCalledWith(
      '❗ SIGINT received, starting graceful shutdown...',
    );
    expect(httpsCloseMock).toHaveBeenCalled();
  });

  it('should call unref on the shutdown timeout', () => {
    const mockTimeout = {
      unref: vi.fn(),
    };
    setTimeoutSpy.mockReturnValueOnce(mockTimeout as unknown as NodeJS.Timeout);

    gracefulShutdown(mockServer, 'SIGTERM');
    expect(mockTimeout.unref).toHaveBeenCalled();
  });
});
