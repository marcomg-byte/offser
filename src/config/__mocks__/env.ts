/**
 * Mock environment configuration for unit tests.
 * Provides fake values for required environment variables so tests can run
 * without relying on actual .env files or process.env.
 */
const env = {
  MAIL_FROM: 'mock@example.com',
  SMTP_HOST: 'smtp.mockserver.com',
  SMTP_PORT: 587,
  SMTP_USER: 'mockuser',
  SMTP_PASS: 'mockpass',
};

export { env };
