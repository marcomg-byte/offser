import { Pool, PoolConnection } from 'mysql2/promise.js';

/**
 * Error thrown when database connection verification fails.
 *
 * @class DBConnectionVerificationError
 * @extends {Error}
 * @param {Pool} [pool] - The MySQL pool connection associated with the error.
 * @param {unknown} [cause] - The underlying cause of the error, if any.
 */
class DBConnectionVerificationError extends Error {
  /** The MySQL pool connection associated with the error. */
  public pool?: Pool;

  /**
   * Creates an instance of DBConnectionVerificationError.
   * @param {Pool} [pool] - The MySQL pool connection associated with the error.
   * @param {unknown} [cause] - The underlying cause of the error, if any.
   */
  constructor(pool?: Pool, cause?: unknown) {
    super('Database Connection Verification Error', { cause });
    this.name = 'DBConnectionVerificationError';
    this.pool = pool;
  }
}

/**
 * Error thrown when database pool creation fails.
 *
 * @class DBPoolCreationError
 * @extends {Error}
 * @param {string} host - The database host.
 * @param {number} port - The database port.
 * @param {string} user - The database user.
 * @param {string} database - The database name.
 * @param {unknown} [cause] - The underlying cause of the error, if any.
 */
class DBPoolCreationError extends Error {
  /** The database host. */
  public host: string;
  /** The database port. */
  public port: number;
  /** The database user. */
  public user: string;
  /** The database name. */
  public database: string;

  /**
   * Creates an instance of DBPoolCreationError.
   * @param {string} host - The database host.
   * @param {number} port - The database port.
   * @param {string} user - The database user.
   * @param {string} database - The database name.
   * @param {unknown} [cause] - The underlying cause of the error, if any.
   */
  constructor(
    host: string,
    port: number,
    user: string,
    database: string,
    cause?: unknown,
  ) {
    super('Database Pool Creation Error', { cause });
    this.name = 'DBPoolCreationError';
    this.host = host;
    this.port = port;
    this.user = user;
    this.database = database;
  }
}

/**
 * Error thrown when a database query execution fails.
 *
 * @class DBQueryExecutionError
 * @extends {Error}
 * @param {string} query - The SQL query that caused the error.
 * @param {Record<string, string | number>} data - The data/parameters used in the query.
 * @param {PoolConnection} connection - The MySQL pool connection used for the query.
 * @param {unknown} [cause] - The underlying cause of the error, if any.
 */
class DBQueryExecutionError extends Error {
  /** The SQL query that caused the error. */
  public query: string;
  /** The data/parameters used in the query. */
  public data: Record<string, string | number>;
  /** The MySQL pool connection used for the query. */
  public connection: PoolConnection;

  /**
   * Creates an instance of DBQueryExecutionError.
   * @param {string} query - The SQL query that caused the error.
   * @param {Record<string, string | number>} data - The data/parameters used in the query.
   * @param {PoolConnection} connection - The MySQL pool connection used for the query.
   * @param {unknown} [cause] - The underlying cause of the error, if any.
   */
  constructor(
    query: string,
    data: Record<string, string | number>,
    connection: PoolConnection,
    cause?: unknown,
  ) {
    super('Database Query Execution Error', { cause });
    this.name = 'DBQueryExecutionError';
    this.query = query;
    this.data = data;
    this.connection = connection;
  }
}

export {
  DBConnectionVerificationError,
  DBPoolCreationError,
  DBQueryExecutionError,
};
