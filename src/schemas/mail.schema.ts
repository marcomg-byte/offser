import { z as zod } from 'zod';

/**
 * Zod schema for validating email request payloads.
 *
 * Defines validation rules for incoming email submission requests.
 * Ensures required fields are present and properly formatted before
 * processing through the mail service.
 *
 * @type {zod.ZodObject}
 *
 * @property {string} to - Recipient email address. Must match a valid email format (user@domain.ext).
 * @property {string} subject - Email subject line. Must contain at least one character from
 *           alphanumeric, spaces, or special characters (. - _ , / \ | and accented letters Á-ÿ).
 * @property {string} [text] - Plain text email body. Optional.
 * @property {string} [html] - HTML email body. Optional.
 * @property {string} [templateName] - Name of the Handlebars template to use (without .hbs extension). Optional.
 * @property {object} [templateData] - Data object for Handlebars template variables. Optional.
 *
 * @example
 * // Validate an email request with HTML
 * const result = mailRequestSchema.safeParse({
 *   to: 'user@example.com',
 *   subject: 'Hello World',
 *   html: '<p>Email content</p>'
 * });
 *
 * // Validate an email request with Handlebars template
 * const result2 = mailRequestSchema.safeParse({
 *   to: 'user@example.com',
 *   subject: 'Welcome!',
 *   templateName: 'welcome',
 *   templateData: { name: 'John', activationLink: 'https://example.com/activate?token=xyz' }
 * });
 *
 * if (result.success) {
 *   // Valid data
 *   const validData = result.data;
 * }
 */
const mailRequestSchema = zod.object({
  to: zod.string().regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'),
  subject: zod
    .string()
    .regex(/([\w.\-_,/\\|Á-ÿ]+\s*)+/, 'Subject cannot be empty'),
  text: zod.string().optional(),
  html: zod.string().optional(),
  templateName: zod.string().optional(),
  templateData: zod.record(zod.string(), zod.unknown()).optional(),
});

export { mailRequestSchema };
