/**
 * Standardized structure for parsed error objects.
 *
 * Defines the essential properties extracted from any error instance
 * to ensure consistent error handling, reporting, and logging across the application.
 * This interface is used to normalize error data for API responses and internal diagnostics.
 *
 * @property cause   The underlying cause of the error, if available (e.g., nested error or exception).
 * @property message The human-readable error message describing the failure.
 * @property name    The error class or type name (e.g., 'TypeError', 'MailDeliveryError').
 * @property stack   The stack trace at the point the error was thrown, if available.
 */
interface ErrorInfo {
  /** The underlying cause of the error, if available. */
  cause?: unknown;
  /** The error message. */
  message: string;
  /** The error class or type name. */
  name: string;
  /** The stack trace, if available. */
  stack?: string;
}

export type { ErrorInfo };
