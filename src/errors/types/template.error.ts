import { ErrorInfo } from './error.js';

/**
 * Extended error information for template compilation failures.
 *
 * Captures details about the template, the data used, and the underlying error that caused the failure.
 * Used for consistent error handling and logging when a template fails to compile or render.
 */
interface TemplateCompileErrorInfo extends ErrorInfo {
  /** The original error that caused the template compilation failure, if available. */
  rootError?: unknown;
  /** The name of the template that failed to compile. */
  templateName: string;
  /** The data provided to the template during compilation. */
  templateData: Record<string, unknown>;
}

/**
 * Extended error information for template preload failures.
 *
 * Captures the underlying error that occurred during the template preloading process.
 * Used for consistent error handling and logging when templates fail to preload at startup or runtime.
 */
interface TemplatePreloadErrorInfo extends ErrorInfo {
  /** The original error that caused the template preload failure, if available. */
  rootError?: unknown;
}

export type { TemplateCompileErrorInfo, TemplatePreloadErrorInfo };
