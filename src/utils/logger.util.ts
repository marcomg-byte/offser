/**
 * Logs an error to the console with an optional title.
 *
 * @param error - The error object or message to log.
 * @param title - An optional title to prefix the error log.
 */
const logError = (error: object | string, title?: string): void => {
  if (title) {
    console.error(`❌ ${title}`);
  }

  console.error(error);
};

export { logError };
