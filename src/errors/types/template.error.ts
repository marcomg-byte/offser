import { ErrorInfo } from './error.js';

/**
 * Extended error information for template compilation failures.
 *
 * Captures details about the template, the data used, and the underlying error that caused the failure.
 * Used for consistent error handling and logging when a template fails to compile or render.
 */
interface TemplateCompileErrorInfo extends ErrorInfo {
  /** The name of the template that failed to compile. */
  templateName: string;
  /** The data provided to the template during compilation. */
  templateData: Record<string, unknown>;
}

/**
 * Extended error information for unknown template errors.
 *
 * Captures the template name (if available) and the underlying error for debugging purposes.
 * Used for consistent error handling and logging when an unexpected template-related error occurs.
 */
interface UnknownTemplateErrorInfo extends ErrorInfo {
  /** The name of the template involved in the error, if available. */
  templateName?: string;
}

export type { TemplateCompileErrorInfo, UnknownTemplateErrorInfo };
