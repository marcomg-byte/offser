import { describe, it, beforeEach, afterAll, vi, expect } from 'vitest';

describe('env.ts', () => {
  const OLD_ENV = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...OLD_ENV };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  describe('required', () => {
    it('should return the value of an existing environment variable', async () => {
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@test.com';
      process.env.SMTP_PASS = 'password';
      process.env.MAIL_FROM = 'from@test.com';
      process.env.MAIL_SERVICE_RATE_LIMIT = '100';
      process.env.MAIL_SERVICE_RATE_WINDOW = '15';
      process.env.NODE_ENV = 'test';
      process.env.RENDER_SERVICE_RATE_LIMIT = '50';
      process.env.RENDER_SERVICE_RATE_WINDOW = '10';
      process.env.DB_HOST = 'localhost';
      process.env.DB_PORT = '3306';
      process.env.DB_USER = 'dbuser';
      process.env.DB_PASS = 'dbpassword';
      process.env.DB_NAME = 'testdb';

      const { env } = await import('./env.js');
      expect(env.SMTP_HOST).toBe('smtp.test.com');
      expect(env.SMTP_PORT).toBe(587);
      expect(env.SMTP_USER).toBe('user@test.com');
      expect(env.SMTP_PASS).toBe('password');
      expect(env.MAIL_FROM).toBe('from@test.com');
      expect(env.MAIL_SERVICE_RATE_LIMIT).toBe(100);
      expect(env.MAIL_SERVICE_RATE_WINDOW).toBe(15);
      expect(env.NODE_ENV).toBe('TEST');
      expect(env.RENDER_SERVICE_RATE_LIMIT).toBe(50);
      expect(env.RENDER_SERVICE_RATE_WINDOW).toBe(10);
      expect(env.DB_HOST).toBe('localhost');
      expect(env.DB_PORT).toBe(3306);
      expect(env.DB_USER).toBe('dbuser');
      expect(env.DB_PASS).toBe('dbpassword');
      expect(env.DB_NAME).toBe('testdb');
    });

    it('should throw an error if the environment variable is missing', async () => {
      delete process.env.SMTP_HOST;
      const importAndReadRequiredVar = async () => {
        await import('./env.js');
      };
      await expect(importAndReadRequiredVar).rejects.toThrowError(
        'Missing required environment variable: SMTP_HOST',
      );
    });

    it('should throw and error for an empty string value', async () => {
      process.env.SMTP_HOST = '';
      // Set other required variables to avoid unrelated errors
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@test.com';
      process.env.SMTP_PASS = 'password';
      process.env.MAIL_FROM = 'from@test.com';
      process.env.MAIL_SERVICE_RATE_LIMIT = '100';
      process.env.MAIL_SERVICE_RATE_WINDOW = '15';
      process.env.NODE_ENV = 'test';
      process.env.RENDER_SERVICE_RATE_LIMIT = '50';
      process.env.RENDER_SERVICE_RATE_WINDOW = '10';

      const importAndReadRequiredVar = async () => {
        await import('./env.js');
      };
      await expect(importAndReadRequiredVar).rejects.toThrowError(
        'Missing required environment variable: SMTP_HOST',
      );
    });
  });

  describe('env object', () => {
    it('should correctly load all required environment variables', async () => {
      process.env.PORT = '8080';
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@test.com';
      process.env.SMTP_PASS = 'password';
      process.env.MAIL_FROM = 'from@test.com';
      process.env.MAIL_SERVICE_RATE_LIMIT = '100';
      process.env.MAIL_SERVICE_RATE_WINDOW = '15';
      process.env.NODE_ENV = 'test';
      process.env.RENDER_SERVICE_RATE_LIMIT = '50';
      process.env.RENDER_SERVICE_RATE_WINDOW = '10';
      process.env.HTTPS_ENABLED = 'true';
      process.env.HTTPS_KEY_PATH = '/path/to/key.pem';
      process.env.HTTPS_CERT_PATH = '/path/to/cert.pem';
      process.env.DB_HOST = 'localhost';
      process.env.DB_PORT = '3306';
      process.env.DB_USER = 'dbuser';
      process.env.DB_PASS = 'dbpassword';
      process.env.DB_NAME = 'testdb';

      const { env } = await import('./env.js');

      expect(env.PORT).toBe(8080);
      expect(env.SMTP_HOST).toBe('smtp.test.com');
      expect(env.SMTP_PORT).toBe(587);
      expect(env.SMTP_USER).toBe('user@test.com');
      expect(env.SMTP_PASS).toBe('password');
      expect(env.MAIL_FROM).toBe('from@test.com');
      expect(env.MAIL_SERVICE_RATE_LIMIT).toBe(100);
      expect(env.MAIL_SERVICE_RATE_WINDOW).toBe(15);
      expect(env.NODE_ENV).toBe('TEST'); // Note: .toUpperCase()
      expect(env.RENDER_SERVICE_RATE_LIMIT).toBe(50);
      expect(env.RENDER_SERVICE_RATE_WINDOW).toBe(10);
      expect(env.HTTPS_ENABLED).toBe(true);
      expect(env.HTTPS_KEY_PATH).toBe('/path/to/key.pem');
      expect(env.HTTPS_CERT_PATH).toBe('/path/to/cert.pem');
      expect(env.DB_HOST).toBe('localhost');
      expect(env.DB_PORT).toBe(3306);
      expect(env.DB_USER).toBe('dbuser');
      expect(env.DB_PASS).toBe('dbpassword');
      expect(env.DB_NAME).toBe('testdb');
    });

    it('should use default values for optional variables when they are not set', async () => {
      process.env.SMTP_HOST = 'smtp.test.com';
      process.env.SMTP_PORT = '587';
      process.env.SMTP_USER = 'user@test.com';
      process.env.SMTP_PASS = 'password';
      process.env.MAIL_FROM = 'from@test.com';
      process.env.MAIL_SERVICE_RATE_LIMIT = '100';
      process.env.MAIL_SERVICE_RATE_WINDOW = '15';
      process.env.NODE_ENV = 'development';
      process.env.RENDER_SERVICE_RATE_LIMIT = '50';
      process.env.RENDER_SERVICE_RATE_WINDOW = '10';
      process.env.DB_HOST = 'localhost';
      process.env.DB_PORT = '3306';
      process.env.DB_USER = 'dbuser';
      process.env.DB_PASS = 'dbpassword';
      process.env.DB_NAME = 'testdb';

      const { env } = await import('./env.js');

      expect(env.PORT).toBe(3000);
      expect(env.HTTPS_ENABLED).toBe(false);
      expect(env.HTTPS_KEY_PATH).toBe('./key.pem');
      expect(env.HTTPS_CERT_PATH).toBe('./cert.pem');
    });
  });
});
