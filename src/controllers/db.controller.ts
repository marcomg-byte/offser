import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { logger, formatDate } from '../utils/index.js';
import {
  dbDeleteSchema,
  dbInsertSchema,
  dbReadSchema,
} from '../schemas/index.js';
import { pool, verifyDBConnection } from '../services/index.js';

interface Record extends RowDataPacket {
  ID: string;
  MAIL: string;
  PASSWORD: string;
}

const insertDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const connection = await pool.getConnection();
  try {
    const data = dbInsertSchema.parse(req.body);
    const { mail, password } = data;
    await connection.beginTransaction();
    await connection.query('CALL INSERT_PASSWORD (?, ?)', [mail, password]);
    await connection.commit();

    logger.info(`📊 Data inserted successfully for mail: ${mail}`);
    return res.status(200).json({ title: 'Data Inserted Successfully!', data });
  } catch (error: unknown) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const readDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const connection = await pool.getConnection();
  try {
    const { lowerLimit, upperLimit } = dbReadSchema.parse(req.body);
    await connection.beginTransaction();
    const [records] = await connection.query<Record[][]>(
      'CALL READ_PASSWORDS (?, ?)',
      [upperLimit, lowerLimit ?? null],
    );
    await connection.commit();
    logger.info(
      `📊 Data read successfully between IDs ${lowerLimit} and ${upperLimit}`,
    );
    return res
      .status(200)
      .json({ title: 'Data Read Successfully!', data: records[0] });
  } catch (error: unknown) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const deleteDataHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const connection = await pool.getConnection();
  try {
    const { lowerLimit, upperLimit } = dbDeleteSchema.parse(req.body);
    await connection.beginTransaction();
    await connection.query('CALL DELETE_ENTRY (?, ?)', [
      lowerLimit,
      upperLimit ?? null,
    ]);
    await connection.commit();

    if (lowerLimit && upperLimit) {
      logger.info(
        `📊 Data deleted successfully between IDs ${lowerLimit} and ${upperLimit}`,
      );
    } else if (lowerLimit) {
      logger.info(`📊 Data deleted successfully for ID: ${lowerLimit}`);
    }

    return res
      .status(200)
      .json({ title: 'Data Deleted Successfully!', lowerLimit, upperLimit });
  } catch (error: unknown) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

const healthCheckHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const connection = await verifyDBConnection();
    const date = new Date();
    const info = {
      timestamp: date.toISOString(),
      localDate: formatDate(date),
      uptime: Number(process.uptime().toFixed(2)),
    };

    logger.info({ info }, '🔍 Database health check requested');

    if (!connection) {
      logger.error('❌ Unhealthy database connection detected');
      return res.status(503).json({ status: 'ERROR', ...info });
    }

    logger.info('✅ Database connection healthy');
    return res.status(200).json({ status: 'OK', ...info });
  } catch (error: unknown) {
    return next(error);
  }
};

export {
  insertDataHandler,
  readDataHandler,
  deleteDataHandler,
  healthCheckHandler,
};
