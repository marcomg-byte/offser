import { env } from '../config/env.js';
import mysql, { Pool } from 'mysql2/promise';
import {
  DBConnectionVerificationError,
  DBPoolCreationError,
  DBSSLConfigError,
} from '../errors/index.js';
import fs from 'fs';

const {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME,
  DB_WAIT_FOR_CONNECTIONS,
  DB_QUEUE_LIMIT,
  DB_CONNECTION_LIMIT,
  DB_KEEP_ALIVE,
  DB_KEEP_ALIVE_INITIAL_DELAY,
  DB_SSL_ENABLED,
  DB_SSL_CA,
  DB_SSL_CERT,
  DB_SSL_KEY,
  DB_SSL_REJECT_UNAUTHORIZED,
} = env;

/**
 * Creates and configures a new MySQL connection pool using environment variables, supporting optional SSL configuration.
 *
 * If SSL is enabled (`DB_SSL_ENABLED`), the function validates the presence of all required SSL parameters (`DB_SSL_CA`, `DB_SSL_CERT`, `DB_SSL_KEY`).
 * Throws a `DBSSLConfigError` if SSL is enabled but configuration is incomplete.
 *
 * @function
 * @returns {Pool} The configured MySQL connection pool.
 * @throws {DBSSLConfigError} If SSL is enabled but configuration is incomplete or invalid.
 * @throws {DBPoolCreationError} If the pool cannot be created due to configuration or connection issues.
 */
function createPool(): Pool {
  const isValidSSLConfig = DB_SSL_CA && DB_SSL_CERT && DB_SSL_KEY;

  if (DB_SSL_ENABLED && !isValidSSLConfig) {
    throw new DBSSLConfigError(
      DB_SSL_CA ?? '',
      DB_SSL_CERT ?? '',
      DB_SSL_KEY ?? '',
      new Error('Incomplete SSL configuration for database connection'),
    );
  }

  try {
    if (DB_SSL_ENABLED && isValidSSLConfig) {
      return mysql.createPool({
        host: DB_HOST,
        port: DB_PORT,
        user: DB_USER,
        password: DB_PASS,
        database: DB_NAME,
        waitForConnections: DB_WAIT_FOR_CONNECTIONS,
        connectionLimit: DB_CONNECTION_LIMIT,
        queueLimit: DB_QUEUE_LIMIT,
        enableKeepAlive: DB_KEEP_ALIVE,
        keepAliveInitialDelay: DB_KEEP_ALIVE_INITIAL_DELAY,
        ssl: {
          ca: fs.readFileSync(DB_SSL_CA, 'utf8'),
          cert: fs.readFileSync(DB_SSL_CERT, 'utf8'),
          key: fs.readFileSync(DB_SSL_KEY, 'utf8'),
          rejectUnauthorized: DB_SSL_REJECT_UNAUTHORIZED,
        },
      });
    }

    return mysql.createPool({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      waitForConnections: DB_WAIT_FOR_CONNECTIONS,
      connectionLimit: DB_CONNECTION_LIMIT,
      queueLimit: DB_QUEUE_LIMIT,
      enableKeepAlive: DB_KEEP_ALIVE,
      keepAliveInitialDelay: DB_KEEP_ALIVE_INITIAL_DELAY,
    });
  } catch (error: unknown) {
    throw new DBPoolCreationError(DB_HOST, DB_PORT, DB_USER, DB_NAME, error);
  }
}

/**
 * The singleton MySQL connection pool instance for the application.
 *
 * @type {Pool}
 */
const pool = createPool();

/**
 * Verifies the health of the database connection pool by attempting to ping the database.
 *
 * @returns {Promise<boolean>} Resolves to true if the connection is alive, false otherwise.
 * @throws {DBConnectionVerificationError} If unable to acquire a connection or ping the database.
 */
async function verifyConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    const isAlive = await connection
      .ping()
      .then(() => true)
      .catch(() => false);
    connection.release();
    return isAlive;
  } catch (error: unknown) {
    throw new DBConnectionVerificationError(pool, error);
  }
}

export { pool, verifyConnection };
