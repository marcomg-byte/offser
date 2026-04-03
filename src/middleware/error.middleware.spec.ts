import { vi, describe, it, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { Request, Response, NextFunction } from 'express';
import { z as zod } from 'zod';
import type { PoolConnection } from 'mysql2/promise';
import { errorHandler } from './error.middleware.js';
import { logger, extractErrorInfo } from '../utils/index.js';
import { createMockTransporter } from '../__mocks__/nodemailer.js';
import {
  DBPoolCreationError,
  ConnectionVerificationError,
  MailDeliveryError,
  TransporterCreationError,
  TemplateCompileError,
  TemplatePreloadError,
  DBQueryExecutionError,
} from '../errors/index.js';
import { env } from '../config/env.js';

vi.mock('../utils/index.js');
vi.mock('../config/env.js');

describe('error.middleware', () => {
  let jsonSpy: Mock;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let statusSpy: Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    jsonSpy = vi.fn();
    statusSpy = vi.fn(() => ({ json: jsonSpy }));

    mockRequest = {};
    mockResponse = { status: statusSpy };
    mockNext = vi.fn();
  });

  it('should handle ZodError with a 400 status code', () => {
    const zodError = new zod.ZodError([
      {
        code: 'invalid_type',
        expected: 'string',
        path: ['name'],
        message: 'Expected string, received number',
      },
    ]);

    errorHandler(
      zodError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(400);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Request Validation Error',
      name: 'ZodError',
      message: expect.any(String) as string,
      stack: undefined,
      cause: undefined,
    });
    expect(extractErrorInfo).toHaveBeenCalledWith(zodError);
    expect(logger.error).toHaveBeenCalledWith(
      {
        errorInfo: {
          name: 'ZodError',
          message: expect.any(String) as string,
          stack: undefined,
          cause: undefined,
        },
      },
      'Request Validation Error',
    );
  });

  it('should handle MailDeliveryError with a 500 status code', () => {
    const mockTransporter = createMockTransporter();
    const mailError = new MailDeliveryError(
      mockTransporter,
      'mock@example.com',
      'Test Subject',
      'Test Body',
      undefined,
      new Error('SMTP connection failed'),
    );
    const mockErrorInfo = {
      name: 'MailDeliveryError',
      message: 'Failed to send email',
      cause: new Error('SMTP connection failed'),
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      mailError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    mockTransporter.isIdle();
    mockTransporter.close();

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Mail Service Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Mail Service Error',
    );
  });

  it('should handle ConnectionVerificationError with a 500 status code', () => {
    const mockTrasnporter = createMockTransporter();
    const connectionError = new ConnectionVerificationError(
      mockTrasnporter,
      new Error('Connection timed out'),
    );
    const mockErrorInfo = {
      name: 'ConnectionVerificationError',
      message: 'Failed to verify connection',
      cause: new Error('Connection timed out'),
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      connectionError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Mail Service Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Mail Service Error',
    );
  });

  it('should handle TransporterCreationError with a 500 status code', () => {
    const { SMTP_PORT, SMTP_HOST, SMTP_USER } = env;
    const transporterError = new TransporterCreationError(
      SMTP_HOST,
      SMTP_PORT,
      SMTP_USER,
      false,
      new Error('Invalid SMTP configuration'),
    );
    const mockErrorInfo = {
      name: 'TransporterCreationError',
      message: 'Failed to create mail transporter',
      cause: new Error('Invalid SMTP configuration'),
      stack: undefined,
    };

    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      transporterError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );
    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Mail Service Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Mail Service Error',
    );
  });

  it('should handle TemplateCompileError with a 500 status code', () => {
    const templateError = new TemplateCompileError(
      'welcome-email',
      {},
      new Error('Syntax error in template'),
    );
    const mockErrorInfo = {
      name: 'TemplateCompileError',
      message: 'Failed to compile template: welcome-email',
      cause: new Error('Syntax error in template'),
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      templateError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Template Compilation Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Template Compilation Error',
    );
  });

  it('should handle TemplatePreloadError with a 500 status code', () => {
    const preloadError = new TemplatePreloadError(
      new Error('Failed to read template directory'),
    );
    const mockErrorInfo = {
      name: 'TemplatePreloadError',
      message: 'Failed to preload templates',
      cause: new Error('Failed to read template directory'),
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      preloadError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Template Compilation Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Template Compilation Error',
    );
  });

  it('should handle DBPoolCreationError with a 500 status code', () => {
    const { DB_HOST, DB_PORT, DB_USER, DB_NAME } = env;
    const dbError = new DBPoolCreationError(
      DB_HOST,
      DB_PORT,
      DB_USER,
      DB_NAME,
      new Error('Invalid DB credentials'),
    );
    const mockErrorInfo = {
      name: 'DBPoolCreationError',
      message: 'Database Pool Creation Error',
      cause: new Error('Invalid DB credentials'),
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValue(mockErrorInfo);

    errorHandler(
      dbError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Database Error',
      ...mockErrorInfo,
    });
  });

  it('should handle DBQueryExecutionError with a 500 status code', () => {
    const cause = new Error('Syntax error in SQL query');
    const dbError = new DBQueryExecutionError(
      'SELECT 1',
      {},
      {} as PoolConnection,
      cause,
    );
    const mockErrorInfo = {
      name: 'DBQueryExecutionError',
      message: 'Database Query Execution Error',
      cause,
      stack: undefined,
    };

    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      dbError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Database Error',
      ...mockErrorInfo,
    });
  });

  it('should handle a generic Error with a 500 status code', () => {
    const genericError = new Error('Something went wrong');
    const mockErrorInfo = {
      name: 'Error',
      message: 'Something went wrong',
      cause: undefined,
      stack: undefined,
    };
    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      genericError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Internal Server Error',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Internal Server Error',
    );
  });

  it('should handle non-Error objects with a 500 status code', () => {
    const unknownError = { details: 'A plain object wast thrown' };
    const mockErrorInfo = { message: 'Unknown error' };

    (extractErrorInfo as Mock).mockReturnValueOnce(mockErrorInfo);

    errorHandler(
      unknownError,
      mockRequest as Request,
      mockResponse as Response,
      mockNext,
    );

    expect(statusSpy).toHaveBeenCalledWith(500);
    expect(jsonSpy).toHaveBeenCalledWith({
      title: 'Unknown Error Occurred',
      ...mockErrorInfo,
    });
    expect(logger.error).toHaveBeenCalledWith(
      { errorInfo: mockErrorInfo },
      'Unknown Error Occurred',
    );
  });
});
