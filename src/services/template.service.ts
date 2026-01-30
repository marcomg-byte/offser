import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { TemplateCompileError, TemplatePreloadError } from '../errors/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRelativePath = '../templates';

const templateCache = new Map<string, handlebars.TemplateDelegate>();

/**
 * Compiles and renders a Handlebars template with the provided data.
 * Uses an in-memory cache to avoid recompiling templates on every request.
 * If the template is not cached, it is loaded from disk, compiled, and cached for future use.
 * Throws a TemplateCompileError if the template file cannot be found, read, or compiled.
 *
 * @param templateName - The name of the template file (without the .hbs extension).
 * @param data - An object containing variables to inject into the template.
 * @returns The rendered HTML string.
 * @throws {TemplateCompileError} If the template file cannot be found, read, or compiled.
 */
function compileTemplate(
  templateName: string,
  data: Record<string, unknown>,
): string {
  try {
    let template = templateCache.get(templateName);

    if (!template) {
      const templatePath = path.join(
        __dirname,
        templatesRelativePath,
        `${templateName}.hbs`,
      );

      if (!fs.existsSync(templatePath)) {
        throw new Error(
          `Template "${templateName}" not found at path: ${templatePath}`,
        );
      }

      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      template = handlebars.compile(templateSource);

      templateCache.set(templateName, template);
    }
    return template(data);
  } catch (error: unknown) {
    throw new TemplateCompileError(templateName, data, error);
  }
}

/**
 * Clears all compiled templates from the in-memory cache.
 * Useful for development or testing when templates may change and need to be reloaded.
 */
function clearTemplateCache(): void {
  templateCache.clear();
}

/**
 * Loads and compiles all Handlebars templates from the templates directory into memory at startup.
 * Each template file is read, compiled, and stored in the templateCache map for fast access.
 * If an error occurs, a TemplatePreloadError is thrown.
 *
 * @returns The number of templates successfully loaded into the cache.
 * @throws {TemplatePreloadError} If any error occurs during the preload process.
 */
function preloadTemplates(): number {
  try {
    const templatesDir = path.join(__dirname, templatesRelativePath);
    const templates = fs.readdirSync(templatesDir);

    templates.forEach((templateName) => {
      const templatePath = path.join(templatesDir, templateName);
      if (fs.existsSync(templatePath)) {
        const templateSource = fs.readFileSync(templatePath, 'utf-8');
        const template = handlebars.compile(templateSource);
        templateCache.set(templateName, template);
      }
    });

    return templateCache.size;
  } catch (error: unknown) {
    throw new TemplatePreloadError(error);
  }
}

export { compileTemplate, clearTemplateCache, preloadTemplates };
