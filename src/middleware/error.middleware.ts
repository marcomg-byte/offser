import { Request, Response, NextFunction } from 'express';
import { ZodError, prettifyError } from 'zod';
import { logError, extractErrorInfo } from '../utils/index.js';
import { MailError, TemplateCompileError } from '../errors/index.js';

/**
 * Express error-handling middleware for centralized error responses in the API.
 *
 * This middleware inspects the type of the error thrown during request processing and
 * determines the appropriate HTTP status code and response title. Extracts standardized
 * error information using extractErrorInfo and returns it in a JSON response.
 *
 * Error handling logic:
 * - ZodError: 400 Bad Request, logs prettified error using z.prettifyError
 * - MailError: 500 Internal Server Error, title 'Mail Service Error'
 * - TemplateCompileError: 500 Internal Server Error, title 'Template Compilation Error'
 * - Generic Error: 500 Internal Server Error, title 'Internal Server Error'
 * - Unknown: 500 Internal Server Error, title 'Unknown Error Occurred'
 *
 * Logging:
 * - ZodError: Logs prettified error string for readability
 * - All others: Logs the error object with a descriptive title
 *
 * @param {unknown} error - The error object thrown in the request pipeline. Can be any type, but typically
 *   a ZodError, MailError, TemplateCompileError, or generic Error instance.
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
 * // MailError response (500)
 * // {
 * //   title: 'Mail Service Error',
 * //   name: 'MailError',
 * //   message: '...',
 * //   smtpHost: '...',
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
    title = 'Request Validation Errors';
    statusCode = 400;
    const prettified = prettifyError(error);
    logError(prettified);
  } else if (error instanceof MailError) {
    title = 'Mail Service Error';
  } else if (error instanceof TemplateCompileError) {
    title = 'Template Compilation Error';
  } else if (error instanceof Error) {
    title = 'Internal Server Error';
  }

  if (!(error instanceof ZodError)) {
    logError(error, title);
  }

  return res.status(statusCode).json({
    title,
    ...errorInfo,
  });
}

export { errorHandler };
