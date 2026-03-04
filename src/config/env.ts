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

  if (!value) {
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
  /** @type {number} SMTP server port. Defaults to 587 if SMTP_PORT env var is not set. */
  SMTP_PORT: Number(process.env.SMTP_PORT ?? 587),
  /** @type {boolean} Whether to use a secure connection (SSL/TLS) for SMTP. Defaults to false if not set. */
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  /** @type {string} SMTP authentication username (email or account name). Required. */
  SMTP_USER: required('SMTP_USER'),
  /** @type {string} SMTP authentication password. Required. Should be kept secure. */
  SMTP_PASS: required('SMTP_PASS'),
  /** @type {string} Default sender email address for outgoing emails. Required. */
  MAIL_FROM: required('MAIL_FROM'),
  /** @type {number} Rate limit for mail service requests. Required. */
  MAIL_SERVICE_RATE_LIMIT: Number(required('MAIL_SERVICE_RATE_LIMIT')),
  /** @type {number} Rate limit window in minutes for mail service requests. Required. */
  MAIL_SERVICE_RATE_WINDOW: Number(required('MAIL_SERVICE_RATE_WINDOW')),
  /** @type {string} Node environment mode (e.g., 'development', 'production', 'test'). Required. */
  NODE_ENV: required('NODE_ENV').toUpperCase(),
  /** @type {string} Database host (e.g., 'localhost' or 'db.example.com'). Required. */
  DB_HOST: required('DB_HOST'),
  /** @type {number} Database port (e.g., 3306 for MySQL). Required. */
  DB_PORT: Number(required('DB_PORT')),
  /** @type {string} Database username. Required. */
  DB_USER: required('DB_USER'),
  /** @type {string} Database password. Required. Should be kept secure. */
  DB_PASS: required('DB_PASS'),
  /** @type {string} Database name. Required. */
  DB_NAME: required('DB_NAME'),
  /** @type {boolean} Flag to determine pool behavior when no connections are available. Defaults to true if DB_WAIT_FOR_CONNECTIONS env var is not set. */
  DB_WAIT_FOR_CONNECTIONS: process.env.DB_WAIT_FOR_CONNECTIONS === 'true',
  /** @type {number} Maximum number of connection requests the pool will queue before returning an error. Defaults to 0 (no limit) if DB_QUEUE_LIMIT env var is not set. */
  DB_QUEUE_LIMIT: Number(process.env.DB_QUEUE_LIMIT ?? 0),
  /** @type {number} Maximum number of connections to create at once. Defaults to 10 if DB_CONNECTION_LIMIT env var is not set. */
  DB_CONNECTION_LIMIT: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  /** @type {boolean} Flag to enable MySQL connection keep-alive. Defaults to true if DB_KEEP_ALIVE env var is not set. */
  DB_KEEP_ALIVE: process.env.DB_KEEP_ALIVE === 'true',
  /** @type {number} Initial delay in milliseconds before starting keep-alive pings. Defaults to 0 if DB_KEEP_ALIVE_INITIAL_DELAY env var is not set. */
  DB_KEEP_ALIVE_INITIAL_DELAY: Number(
    process.env.DB_KEEP_ALIVE_INITIAL_DELAY ?? 0,
  ),
  /** @type {boolean} Flag to enable SSL for database connections. Defaults to false if DB_SSL_ENABLED env var is not set. */
  DB_SSL_ENABLED: process.env.DB_SSL_ENABLED === 'true',
  /** @type {string | undefined} Path to the SSL CA file. Optional. */
  DB_SSL_CA: process.env.DB_SSL_CA || undefined,
  /** @type {string | undefined} Path to the SSL certificate file. Optional. */
  DB_SSL_CERT: process.env.DB_SSL_CERT || undefined,
  /** @type {string | undefined} Path to the SSL key file. Optional. */
  DB_SSL_KEY: process.env.DB_SSL_KEY || undefined,
  /** @type {boolean} Flag to reject unauthorized SSL connections. Defaults to true if DB_SSL_REJECT_UNAUTHORIZED env var is not set. */
  DB_SSL_REJECT_UNAUTHORIZED:
    process.env.DB_SSL_REJECT_UNAUTHORIZED === 'false',
  /**
   * @type {number} Rate limit for render service requests. Required.
   * Maximum number of render requests allowed per window.
   */
  RENDER_SERVICE_RATE_LIMIT: Number(required('RENDER_SERVICE_RATE_LIMIT')),
  /**
   * @type {number} Rate limit window in minutes for render service requests. Required.
   * Time window (in minutes) for the render service rate limit.
   */
  RENDER_SERVICE_RATE_WINDOW: Number(required('RENDER_SERVICE_RATE_WINDOW')),
  /** @type {boolean} Flag to enable HTTPS. Defaults to false if HTTPS_ENABLED env var is not set. */
  HTTPS_ENABLED: process.env.HTTPS_ENABLED === 'true',
  /** @type {string} File path to the HTTPS key. Required if HTTPS is enabled. */
  HTTPS_KEY_PATH: process.env.HTTPS_KEY_PATH || './key.pem',
  /** @type {string} File path to the HTTPS certificate. Required if HTTPS is enabled. */
  HTTPS_CERT_PATH: process.env.HTTPS_CERT_PATH || './cert.pem',
};
