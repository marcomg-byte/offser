import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger, extractErrorInfo } from '../utils/index.js';
import {
  DBConnectionVerificationError,
  DBPoolCreationError,
  DBQueryExecutionError,
  MailDeliveryError,
  ConnectionVerificationError,
  TransporterCreationError,
  TemplateCompileError,
  TemplatePreloadError,
} from '../errors/index.js';

/**

 * Centralized Express error-handling middleware for consistent API error responses and logging.
 *
 * This middleware acts as the single point for handling all errors thrown during the request lifecycle.
 * It inspects the error type to determine the appropriate HTTP status code, response title, and error details.
 *
 * Key features:
 * - Maps known error types (validation, mail, template) to specific HTTP status codes and user-friendly titles.
 * - Extracts and standardizes error information for API clients using extractErrorInfo.
 * - Provides detailed, prettified validation errors for Zod schema failures.
 * - Logs all errors with context-aware titles for easier debugging and monitoring.
 * - Ensures all errors are handled gracefully, preventing unhandled exceptions and always returning a JSON response.
 *
 * Error handling logic:
 * - ZodError: 400 Bad Request, returns prettified validation issues under the 'error' key.
 * - MailDeliveryError, ConnectionVerificationError, TransporterCreationError: 500 Internal Server Error, title 'Mail Service Error', includes mail context.
 * - TemplateCompileError, TemplatePreloadError: 500 Internal Server Error, title 'Template Compilation Error', includes template context.
 * - Generic Error: 500 Internal Server Error, title 'Internal Server Error', includes error details.
 * - Unknown/Non-Error: 500 Internal Server Error, title 'Unknown Error Occurred'.
 *
 * Logging:
 * - ZodError: Logs a prettified error string for readability and debugging.
 * - All other errors: Logs the error object and extracted info with a descriptive title.
 *
 * This middleware should be registered after all other routes and middleware in your Express app.
 *
 * Example error responses:
 * - Validation error (400):
 *   {
 *     "title": "Request Validation Error",
 *     "error": "...prettified validation issues..."
 *   }
 * - Mail service error (500):
 *   {
 *     "title": "Mail Service Error",
 *     "name": "MailDeliveryError",
 *     "message": "...",
 *     "to": "...",
 *     ...
 *   }
 * - Template compilation error (500):
 *   {
 *     "title": "Template Compilation Error",
 *     "name": "TemplateCompileError",
 *     "message": "...",
 *     ...
 *   }
 *
 * @param {unknown} error - The error object thrown in the request pipeline. Can be any type, but typically
 *   a ZodError, MailDeliveryError, ConnectionVerificationError, TransporterCreationError, TemplateCompileError, or generic Error instance.
 * @param _req - Express request object (unused in this middleware).
 * @param res - Express response object used to send the error response.
 * @param _next - Express next function (unused in this middleware).
 *
 * @returns {Response} Sends a JSON error response with a descriptive title and extracted error info.
 *
 * @throws This middleware does not throw. All errors are handled and a response is always sent.
 *
 * @example
 * // ZodError response (400)
 * // {
 * //   title: 'Request Validation Errors',
 * //   name: 'ZodError',
 * //   issues: [...],
 * //   ...
 * // }
 *
 * @example
 * // Mail Service Error response (500)
 * // {
 * //   title: 'Mail Service Error',
 * //   name: 'MailDeliveryError',
 * //   message: '...',
 * //   to: '...',
 * //   ...
 * // }
 */
function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const errorInfo = extractErrorInfo(error);
  let statusCode = 500;
  let title = 'Unknown Error Occurred';

  if (error instanceof ZodError) {
    title = 'Request Validation Error';
    statusCode = 400;
  } else if (
    error instanceof DBConnectionVerificationError ||
    error instanceof DBPoolCreationError ||
    error instanceof DBQueryExecutionError
  ) {
    title = 'Database Error';
  } else if (
    error instanceof MailDeliveryError ||
    error instanceof ConnectionVerificationError ||
    error instanceof TransporterCreationError
  ) {
    title = 'Mail Service Error';
  } else if (
    error instanceof TemplateCompileError ||
    error instanceof TemplatePreloadError
  ) {
    title = 'Template Compilation Error';
  } else if (error instanceof Error) {
    title = 'Internal Server Error';
  }

  logger.error({ errorInfo }, title);
  return res.status(statusCode).json({
    title,
    ...errorInfo,
  });
}

export { errorHandler };
