import { Request, Response, NextFunction } from 'express';
import { ZodError, prettifyError } from 'zod';
import { logError, extractErrorInfo } from '../utils/index.js';
import {
  CustomZodError,
  MailError,
  TemplateCompileError,
} from '../errors/index.js';

/**
 * Express error-handling middleware for centralized error responses in the API.
 *
 * This middleware inspects the type of the error thrown during request processing and
 * determines the appropriate HTTP status code and response title. It supports:
 *
 * - Zod validation errors (400 Bad Request, prettified output)
 * - Mail service errors (500 Internal Server Error)
 * - Template compilation errors (500 Internal Server Error)
 * - Generic errors (500 Internal Server Error)
 * - Unknown error types (500 Internal Server Error)
 *
 * All non-validation errors are logged for diagnostics. The response always includes a
 * descriptive title and additional error information extracted from the error object.
 *
 * @param {unknown} error - The error object thrown in the request pipeline. Can be any type, but typically
 *   a ZodError, MailError, TemplateCompileError, or generic Error.
 * @param {Request} _req - Express request object (unused in this middleware).
 * @param {Response} res - Express response object used to send the error response.
 * @param {NextFunction} _next - Express next function (unused in this middleware).
 *
 * @returns {Response} Sends a JSON error response with a descriptive title and extracted error info.
 *
 * @throws This middleware does not throw. All errors are handled and a response is always sent.
 */
function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const errorInfo = extractErrorInfo(error);
  let statusCode = 500;
  let title;

  switch (error) {
    case error instanceof ZodError:
      title = 'Request Validation Errors';
      statusCode = 400;
      prettifyError(CustomZodError);
      break;
    case error instanceof MailError:
      title = 'Mail Service Error';
      break;
    case error instanceof TemplateCompileError:
      title = 'Template Compilation Error';
      break;
    case error instanceof Error:
      title = 'Internal Server Error';
      break;
    default:
      title = 'Unknown Error Occurred';
      break;
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
