import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { TemplateCompileError, TemplatePreloadError } from '../errors/index.js';
import { env } from '../config/env.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesRelativePath = '../templates';

const templateCache = new Map<string, handlebars.TemplateDelegate>();

const shouldCache = env.NODE_ENV === 'PRODUCTION';

/**
 * Represents a single password record for export or template rendering.
 * @interface PasswordRecord
 *
 * @property id - Unique identifier for the password record.
 * @property mail - Email address associated with the password.
 * @property password - The password value.
 */
interface PasswordRecord {
  id: number;
  mail: string;
  password: string;
}

/**
 * @function registerHelpers
 * Registers custom Handlebars helpers for template rendering.
 *
 * Currently registers the 'toCSV' helper, which converts an array of PasswordRecord objects
 * into a CSV-formatted string. The CSV includes headers (ID, MAIL, PASSWORD) and each record as a row.
 *
 * Example usage in a Handlebars template:
 *   {{toCSV passwords}}
 *
 * @private
 */
function registerHelpers(): void {
  handlebars.registerHelper('toCSV', function (passwords: PasswordRecord[]) {
    if (!passwords || passwords.length === 0) return '';

    const headers =
      Object.keys(passwords[0])
        .map((key) => `"${key.toUpperCase()}"`)
        .join(',') + '\n';

    const rows = passwords
      .map((record) => `"${record.id}", "${record.mail}", "${record.password}"`)
      .join('\n');

    return headers + rows;
  });
}

/**
 * Immediately register all custom Handlebars helpers on module load.
 * Ensures helpers are available before any template compilation occurs.
 */
registerHelpers();

/**
 * Compiles and renders a Handlebars template with the provided data.
 *
 * In production environments (NODE_ENV === 'production'), uses an in-memory cache to avoid
 * recompiling templates on every request, significantly improving performance.
 *
 * In development environments, skips the cache and recompiles templates on each request,
 * allowing developers to see template changes immediately without restarting the server.
 *
 * Template compilation process:
 * - Development: Always reads from disk → compiles → renders (no caching)
 * - Production: Checks cache → if not cached, reads from disk → compiles → caches → renders
 *
 * @param templateName - The name of the template file (without the .hbs extension).
 * @param data - An object containing variables to inject into the template.
 * @returns The rendered HTML string.
 * @throws {TemplateCompileError} If the template file cannot be found, read, or compiled.
 *
 * @example
 * // Development: Template changes are reflected immediately
 * const html = compileTemplate('sales', { offers: [...] });
 *
 * @example
 * // Production: Template is cached after first compilation
 * const html = compileTemplate('shipment', { orderNumber: '12345', ... });
 */
function compileTemplate(
  templateName: string,
  data: Record<string, unknown>,
): string {
  try {
    if (!shouldCache) {
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
      const template = handlebars.compile(templateSource);
      return template(data);
    }

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
 * `NOTE`: This function should only be executed for production environments where templates
 * are not expected to change at runtime.
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
