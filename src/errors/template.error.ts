/**
 * Custom error for template compilation failures.
 *
 * Thrown when a Handlebars template cannot be compiled or rendered.
 * Includes the original error for debugging purposes.
 */
/**
 * Custom error for template compilation failures.
 *
 * Thrown when a Handlebars template cannot be compiled or rendered.
 * Captures the template name and the original error for debugging purposes.
 */
/**
 * Custom error for template compilation failures.
 *
 * Thrown when a Handlebars template cannot be compiled or rendered.
 * Captures the template name, the data provided, and the original error for debugging purposes.
 */
class TemplateCompileError extends Error {
  /**
   * The original error thrown during template compilation or file reading.
   */
  public rootError?: unknown;
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
   * @param rootError - The original error thrown by the underlying operation (optional).
   */
  constructor(
    templateName: string,
    templateData: Record<string, unknown>,
    rootError?: unknown,
  ) {
    super(`Failed to compile template: ${templateName}`);
    this.name = 'TemplateCompileError';
    this.templateName = templateName;
    this.templateData = templateData;
    this.rootError = rootError;
  }
}

/**
 * Custom error for template preload failures.
 *
 * Thrown when the application fails to preload Handlebars templates at startup or runtime.
 * Captures the original error for debugging purposes.
 *
 * Properties:
 * - rootError: The original error that caused the preload failure (optional)
 */
class TemplatePreloadError extends Error {
  /** The original error that caused the template preload failure, if available. */
  public rootError?: unknown;
  /**
   * Constructs a new TemplatePreloadError.
   * @param rootError - The original error that caused the failure (optional).
   */
  constructor(rootError?: unknown) {
    super('Failed to preload templates');
    this.name = 'TemplatePreloadError';
    this.rootError = rootError;
  }
}

/**
 * Custom error for unknown template failures.
 *
 * Thrown when an unexpected error occurs related to template operations that does not fit other error types.
 * Captures the template name (if available) and the original error for debugging purposes.
 *
 * Properties:
 * - rootError: The original error that caused the unknown template failure (optional)
 * - templateName: The name of the template involved in the error (optional)
 */
class UnknownTemplateError extends Error {
  /** The original error that caused the unknown template failure, if available. */
  public rootError?: unknown;
  /** The name of the template involved in the error, if available. */
  public templateName?: string;
  /**
   * Constructs a new UnknownTemplateError.
   * @param templateName - The name of the template involved in the error (optional).
   * @param rootError - The original error that caused the failure (optional).
   */
  constructor(templateName?: string, rootError?: unknown) {
    super('An unknown template error occurred');
    this.name = 'UnknownTemplateError';
    this.rootError = rootError;
    this.templateName = templateName;
  }
}

export { TemplateCompileError, TemplatePreloadError, UnknownTemplateError };
