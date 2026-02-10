import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { notFoundHandler } from './not-found.middleware.js';
import { logger } from '../utils/index.js';
import { Request, Response } from 'express';
import { compileTemplate } from '../services/index.js';

vi.mock('../utils/index.js');

vi.mock('../services/index.js');

describe('not-found.middleware', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let sendSpy: Mock;
  let statusSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    sendSpy = vi.fn();
    statusSpy = vi.fn().mockReturnThis();

    mockReq = {
      originalUrl: '/test-path',
      method: 'GET',
    };

    mockRes = {
      status: statusSpy,
      send: sendSpy,
    };

    (compileTemplate as Mock).mockReturnValue('<html>404 page</html>');
  });

  it('should set the status to 404', () => {
    notFoundHandler(mockReq as Request, mockRes as Response);
    expect(statusSpy).toHaveBeenCalledWith(404);
  });

  it('should send the compiled "not-found" template as the response', () => {
    notFoundHandler(mockReq as Request, mockRes as Response);
    expect(compileTemplate).toHaveBeenCalledWith('not-found', {});
    expect(sendSpy).toHaveBeenCalledWith('<html>404 page</html>');
  });

  it('should log a warning with request details', () => {
    const path = '/test-path';
    const method = 'GET';
    mockReq.originalUrl = path;
    mockReq.method = method;

    notFoundHandler(mockReq as Request, mockRes as Response);

    expect(logger.warn).toHaveBeenCalledWith(
      { request: { path, method } },
      `🚫 404 Not Found: ${path}`,
    );
  });

  it('should use req.originalUrl for the path if available', () => {
    mockReq.originalUrl = '/original-url';
    mockReq.url = '/fallback-url';

    notFoundHandler(mockReq as Request, mockRes as Response);

    expect(logger.warn).toHaveBeenCalledWith(
      { request: { path: '/original-url', method: 'GET' } },
      `🚫 404 Not Found: /original-url`,
    );
  });

  it('should fall back to req.url if req.originalUrl is not available', () => {
    mockReq.originalUrl = undefined;
    mockReq.url = '/fallback-path';

    notFoundHandler(mockReq as Request, mockRes as Response);

    expect(logger.warn).toHaveBeenCalledWith(
      { request: { path: '/fallback-path', method: 'GET' } },
      `🚫 404 Not Found: /fallback-path`,
    );
  });
});
