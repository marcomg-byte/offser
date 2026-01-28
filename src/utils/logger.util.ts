import { extractErrorInfo } from './index.js';

/**
 * Logs error information to the console in a standardized format.
 *
 * Extracts detailed error info using extractErrorInfo and prints it to stderr.
 * Handles string errors by logging them directly, and structured errors by
 * extracting and logging their properties. Optionally prints a custom title
 * before the error details.
 *
 * @param error - The error object to log. Can be a string, Error instance, or any type.
 *   If a string is provided, it's logged directly. Otherwise, extractErrorInfo is used.
 * @param title - Optional custom title to prefix the error log with an ❌ emoji.
 *
 * @returns {void}
 *
 * @example
 * // Log a standard error with title
 * logError(new Error('Something went wrong'), 'Critical Failure');
 * // Output:
 * // ❌ Critical Failure
 * // { name: 'Error', message: 'Something went wrong', ... }
 *
 * @example
 * // Log a string error
 * logError('Connection timeout', 'Network Error');
 * // Output:
 * // ❌ Network Error
 * // Connection timeout
 */
const logError = (error: unknown, title?: string): void => {
  if (title) {
    console.error(`❌ ${title}`);
  }

  if (typeof error === 'string') {
    console.error(error);
    return;
  }

  const errorInfo = extractErrorInfo(error);
  console.error(errorInfo);
};

export { logError };
