/**
 * Logs error information to the console with structured formatting.
 * 
 * Handles both Error instances and unknown error types with appropriate
 * formatting. Error instances are logged with detailed properties (cause, message,
 * name, stack), while unknown errors are logged as-is.
 * 
 * @param {unknown} error - The error object or value to log. Can be an Error instance
 *        or any other type (string, object, etc.).
 * @param {string} [title] - Optional custom title/label for the error.
 *        Defaults to 'Error occurred' for Error instances and 'Unknown error occurred'
 *        for non-Error types.
 * 
 * @returns {void} Does not return a value. Outputs to console.error.
 * 
 * @example
 * // Logging a standard Error instance
 * try {
 *   throw new Error('Database connection failed');
 * } catch (err) {
 *   logError(err, 'Database Error');
 *   // Output: ❌ Database Error
 *   // { title: 'Database Error', cause: ..., error: 'Database connection failed', ... }
 * }
 * 
 * @example
 * // Logging an unknown error type
 * const unknownError = 'Something went wrong';
 * logError(unknownError, 'Critical Issue');
 * // Output: ❌ Critical Issue
 * //         'Something went wrong'
 */
const logError = (error: unknown, title?: string): void => {
    if (error instanceof Error) {
        console.error(`❌ ${title || 'Error occurred'}`);
        console.error({
            title: title || 'Error occurred',
            cause: error?.cause,
            error: error.message,
            name: error.name,
            stack: error?.stack
        });
    } else {
        console.error(`❌ ${title || 'Unknown error occurred'}`);
        console.error(error);
    }
};

export { logError };