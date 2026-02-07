/**
 * Custom error for template compilation failures.
 *
 * Thrown when a Handlebars template cannot be compiled or rendered.
 * Captures the template name, the data provided, and the original error for debugging purposes.
 */
class TemplateCompileError extends Error {
  /**
   * The name of the template that failed to compile.
   */
  public templateName: string;
  /**
   * The data provided to the template during compilation.
   */
  public templateData: Record<string, unknown>;
  /**
   * Constructs a new TemplateCompileError.
   * @param templateName - The name of the template that failed to compile.
   * @param templateData - The data provided to the template during compilation.
   * @param cause - The original error thrown by the underlying operation (optional).
   */
  constructor(
    templateName: string,
    templateData: Record<string, unknown>,
    cause?: unknown,
  ) {
    super(`Failed to compile template: ${templateName}`, { cause });
    this.name = 'TemplateCompileError';
    this.templateName = templateName;
    this.templateData = templateData;
  }
}

/**
 * Custom error for template preload failures.
 *
 * Thrown when the application fails to preload Handlebars templates at startup or runtime.
 * Captures the original error for debugging purposes.
 */
class TemplatePreloadError extends Error {
  /**
   * Constructs a new TemplatePreloadError.
   * @param cause - The original error that caused the failure (optional).
   */
  constructor(cause?: unknown) {
    super('Failed to preload templates', { cause });
    this.name = 'TemplatePreloadError';
  }
}

/**
 * Custom error for unknown template failures.
 *
 * Thrown when an unexpected error occurs related to template operations that does not fit other error types.
 * Captures the template name and the original error for debugging purposes.
 *
 * Properties:
 * - templateName: The name of the template involved in the error
 */
class UnknownTemplateError extends Error {
  /** The name of the template involved in the error. */
  public templateName: string;
  /**
   * Constructs a new UnknownTemplateError.
   * @param templateName - The name of the template involved in the error.
   * @param cause - The original error that caused the failure (optional).
   */
  constructor(templateName: string, cause?: unknown) {
    super(`Unknown template: ${templateName}`, { cause });
    this.name = 'UnknownTemplateError';
    this.templateName = templateName;
  }
}

export { TemplateCompileError, TemplatePreloadError, UnknownTemplateError };
