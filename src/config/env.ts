/**
 * Retrieves a required environment variable or throws an error if missing.
 * 
 * Validates that a specified environment variable exists and has a value.
 * This function enforces fail-fast initialization - if any required variable
 * is missing, the application terminates immediately during startup rather than
 * continuing with undefined values.
 * 
 * @param {string} name - The name of the environment variable to retrieve.
 * 
 * @returns {string} The value of the environment variable as a string.
 * 
 * @throws {Error} Throws an error with message:
 *        "Missing required environment variable: {name}"
 *        if the variable is not set or is empty. This causes immediate
 *        application termination during initialization.
 * 
 * @example
 * // Get a required SMTP_HOST variable
 * const smtpHost = required('SMTP_HOST');
 * // → Returns 'mail.example.com' (string)
 * 
 * // If SMTP_HOST is not set:
 * // → Throws: Error: Missing required environment variable: SMTP_HOST
 * // → Application startup fails immediately
 */
function required(name: string): string {
    const value = process.env[name];

    if(!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return value;
}

/**
 * Application environment configuration object.
 * 
 * Aggregates all required and optional environment variables needed for the
 * application to run. All required variables must be set via environment or
 * the application will fail to initialize. The PORT variable is optional with
 * a sensible default of 3000.
 * 
 * @type {Object}
 * @const
 * 
 * @example
 * import { env } from './config/env.js';
 * 
 * const server = app.listen(env.PORT);
 * const transporter = nodemailer.createTransport({
 *   host: env.SMTP_HOST,
 *   port: env.SMTP_PORT,
 *   auth: { user: env.SMTP_USER, pass: env.SMTP_PASS }
 * });
 */
export const env = {
    /** @type {number} Server listening port. Defaults to 3000 if PORT env var is not set. */
    PORT: Number(process.env.PORT ?? 3000),
    /** @type {string} SMTP server hostname (e.g., 'smtp.gmail.com'). Required. */
    SMTP_HOST: required('SMTP_HOST'),
    /** @type {number} SMTP server port (e.g., 587 for TLS, 465 for SSL). Required. */
    SMTP_PORT: Number(required('SMTP_PORT')),
    /** @type {string} SMTP authentication username (email or account name). Required. */
    SMTP_USER: required('SMTP_USER'),
    /** @type {string} SMTP authentication password. Required. Should be kept secure. */
    SMTP_PASS: required('SMTP_PASS'),
    /** @type {string} Default sender email address for outgoing emails. Required. */
    MAIL_FROM: required('MAIL_FROM')
}