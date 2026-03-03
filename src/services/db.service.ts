import { env } from '../config/env.js';
import mysql, { Pool } from 'mysql2/promise';
import {
  DBConnectionVerificationError,
  DBPoolCreationError,
} from '../errors/index.js';

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
} = env;

/**
 * Creates and configures a new MySQL connection pool using environment variables.
 *
 * @returns {Pool} The configured MySQL connection pool.
 * @throws {DBPoolCreationError} If the pool cannot be created due to configuration or connection issues.
 */
function createPool(): Pool {
  try {
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
