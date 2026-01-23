import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { capitalizeString } from '../utils/index.js';

/**
 * Express error handling middleware for centralized error processing.
 *
 * Catches and handles different error types with appropriate HTTP status codes
 * and response formatting. Logs detailed error information and sends JSON responses
 * to the client.
 *
 * Handles three error scenarios:
 * - Zod validation errors → 400 Bad Request with validation details
 * - Standard Error instances → 500 Internal Server Error with error details
 * - Unknown errors → 500 Internal Server Error with fallback message
 *
 * @param {Object} value - Error handler configuration object.
 * @param {Error|ZodError} value.error - The error object to be handled.
 * @param {string} [value.title] - Custom error title for non-Zod errors.
 *        Defaults to 'Request Validation Errors' for ZodError and
 *        'Internal Server Error' for other Error types.
 * @param {Request} _req - Express request object (unused).
 * @param {Response} res - Express response object for sending error response.
 * @param {NextFunction} _next - Express next function (unused).
 *
 * @returns {Response} Sends a JSON response with error details and appropriate status code.
 *         Does not call next() - terminates the error handling chain.
 *
 * @example
 * // In Express app setup
 * app.use(errorHandler);
 *
 * // Triggered when Zod validation fails
 * // → Response: 400 with validation issues
 *
 * // Triggered by thrown Error
 * // → Response: 500 with error details
 */
function errorHandler(
  value: {
    error: Error | ZodError;
    title?: string;
  },
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const { error, title: errorTitle } = value;

  if (error instanceof ZodError) {
    const title = 'Request Validation Errors';
    const errorInfo = {
      title,
      cause: error?.cause,
      issues: error.issues,
      message: error.message,
      name: error.name,
      stack: error?.stack,
      type: error.type,
    };
    console.error(`❌ ${title}:`);
    console.dir(errorInfo, { depth: 5, colors: true });
    return res.status(400).json({ title, ...errorInfo });
  }

  if (error instanceof Error) {
    const title = capitalizeString(errorTitle || 'Internal Server Error');
    const errorInfo = {
      cause: error?.cause,
      message: error.message,
      name: error.name,
      stack: error?.stack,
    };
    console.error(`❌ ${title}:`);
    console.dir(errorInfo, { depth: 5, colors: true });
    return res.status(500).json({ title, ...errorInfo });
  }

  const title = errorTitle || 'Unknown Error';
  console.error(`❌ ${title}:`);
  console.error(error);
  return res
    .status(500)
    .json({ title, message: 'An unknown error occurred.', error });
}

export { errorHandler };
