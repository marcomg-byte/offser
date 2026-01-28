import fs from 'fs/promises';
import path from 'path';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';
import { TemplateCompileError } from '../errors/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../templates');

/**
 * Compiles and renders a Handlebars template with the provided data.
 *
 * @param templateName - The name of the template file (without the .hbs extension).
 * @param data - An object containing variables to inject into the template.
 * @returns The rendered HTML string.
 * @throws {TemplateCompileError} If the template file cannot be read or compiled.
 */
async function compileTemplate(
  templateName: string,
  data: Record<string, unknown>,
): Promise<string> {
  try {
    const templatePath = path.join(TEMPLATES_DIR, `${templateName}.hbs`);
    const templateContent = await fs.readFile(templatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    return template(data);
  } catch (error: unknown) {
    throw new TemplateCompileError(templateName, data, error);
  }
}

export { compileTemplate };
