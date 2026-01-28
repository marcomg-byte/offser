import { extractErrorInfo } from './index.js';

/**
 * Logs error information to the console in a standardized format.
 *
 * Extracts detailed error info using extractErrorInfo and prints it to stderr.
 * Optionally prints a custom title before the error details.
 *
 * @param error - The error object to log (can be any type).
 * @param title - Optional custom title to prefix the error log.
 *
 * @returns {void}
 *
 * @example
 * logError(new Error('Something went wrong'), 'Critical Failure');
 * // Output:
 * // ❌ Critical Failure
 * // { ...errorInfo }
 */
const logError = (error: unknown, title?: string): void => {
  const errorInfo = extractErrorInfo(error);

  if (title) {
    console.error(`❌ ${title}`);
  }

  console.error(errorInfo);
};

export { logError };
