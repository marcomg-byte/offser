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

class TemplatePreloadError extends Error {
  public rootError?: unknown;

  constructor(rootError?: unknown) {
    super('Failed to preload templates');
    this.name = 'TemplatePreloadError';
    this.rootError = rootError;
  }
}

export { TemplateCompileError, TemplatePreloadError };
