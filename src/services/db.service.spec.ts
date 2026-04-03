import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

vi.mock('../config/env.ts');
vi.mock('mysql2/promise', () => ({
  default: { createPool: vi.fn(() => ({})) },
}));
vi.mock('fs', () => ({
  default: { readFileSync: vi.fn(() => 'mock-cert-content') },
}));

describe('db.service', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('createPool', () => {
    let env: {
      DB_SSL_ENABLED: boolean;
      DB_SSL_CA: string | undefined;
      DB_SSL_CERT: string | undefined;
      DB_SSL_KEY: string | undefined;
    };

    beforeEach(async () => {
      const { env: importedEnv } = await import('../config/env.js');
      env = importedEnv;
    });

    it('should throw DBSSLConfigError when SSL configuration is enabled but is incomplete', async () => {
      env.DB_SSL_ENABLED = true;

      await expect(import('./db.service.js')).rejects.toMatchObject({
        name: 'DBSSLConfigError',
      });
    });

    it('should throw DBPoolCreationError when mysql.createPool throws', async () => {
      const { default: mysql } = await import('mysql2/promise.js');
      const cause = new Error('Connection refused');
      (mysql.createPool as ReturnType<typeof vi.fn>).mockImplementationOnce(
        () => {
          throw cause;
        },
      );

      await expect(import('./db.service.js')).rejects.toMatchObject({
        name: 'DBPoolCreationError',
        cause,
      });
    });

    it('should create pool with SSL options when SSL is enabled and config is complete', async () => {
      env.DB_SSL_ENABLED = true;
      env.DB_SSL_CA = '../../certs/db/ca-cert.pem';
      env.DB_SSL_CERT = '../../certs/db/client-cert.pem';
      env.DB_SSL_KEY = '../../certs/db/client-key.pem';

      const { default: mysql } = await import('mysql2/promise.js');
      const { default: fs } = await import('fs');

      await import('./db.service.js');

      expect(mysql.createPool).toHaveBeenCalledWith(
        expect.objectContaining({
          ssl: expect.objectContaining({
            ca: 'mock-cert-content',
            cert: 'mock-cert-content',
            key: 'mock-cert-content',
          }) as { ssl: { ca: string; cert: string; key: string } },
        }),
      );

      expect(fs.readFileSync).toHaveBeenCalledTimes(3);
      expect(fs.readFileSync).toHaveBeenCalledWith(
        '../../certs/db/ca-cert.pem',
        'utf8',
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        '../../certs/db/client-cert.pem',
        'utf8',
      );
      expect(fs.readFileSync).toHaveBeenCalledWith(
        '../../certs/db/client-key.pem',
        'utf8',
      );
    });
  });

  describe('verifyConnection', () => {
    let mockConnection: {
      ping: ReturnType<typeof vi.fn>;
      release: ReturnType<typeof vi.fn>;
    };

    beforeEach(async () => {
      mockConnection = { ping: vi.fn(), release: vi.fn() };
      const { default: mysql } = await import('mysql2/promise.js');
      (mysql.createPool as ReturnType<typeof vi.fn>).mockReturnValue({
        getConnection: vi.fn().mockResolvedValue(mockConnection),
      });
    });

    it('should return true when ping succeeds', async () => {
      mockConnection.ping.mockResolvedValue(undefined);
      const { verifyConnection } = await import('./db.service.js');

      await expect(verifyConnection()).resolves.toBe(true);
      expect(mockConnection.ping).toHaveBeenCalledOnce();
      expect(mockConnection.release).toHaveBeenCalledOnce();
    });

    it('should return false when ping fails', async () => {
      mockConnection.ping.mockRejectedValue(new Error('Ping failed'));
      const { verifyConnection } = await import('./db.service.js');

      await expect(verifyConnection()).resolves.toBe(false);
      expect(mockConnection.ping).toHaveBeenCalledOnce();
      expect(mockConnection.release).toHaveBeenCalledOnce();
    });

    it('should throw DBConnectionVerificationError when getConnection throws', async () => {
      const cause = new Error('Connection failed');
      const { default: mysql } = await import('mysql2/promise.js');
      (mysql.createPool as ReturnType<typeof vi.fn>).mockReturnValue({
        getConnection: vi.fn().mockRejectedValue(cause),
      });
      const { verifyConnection } = await import('./db.service.js');

      await expect(verifyConnection()).rejects.toMatchObject({
        name: 'DBConnectionVerificationError',
        cause,
      });
    });
  });
});
