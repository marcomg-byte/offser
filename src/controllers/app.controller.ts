import { Request, Response, NextFunction } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { logger } from '../utils/index.js';
import { compileTemplate, pool } from '../services/index.js';
import { dashboardSchema, dbReadSchema } from '../schemas/index.js';

interface Record extends RowDataPacket {
  ID: number;
  MAIL: string;
  PASSWORD: string;
}

const renderDashboardHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const connection = await pool.getConnection();
  try {
    const data = dbReadSchema.parse({
      lowerLimit: req.query.lowerLimit
        ? Number(req.query.lowerLimit)
        : undefined,
      upperLimit: Number(req.query.upperLimit),
    });
    const { lowerLimit, upperLimit } = data;
    await connection.beginTransaction();
    const [records] = await connection.query<Record[][]>(
      'CALL READ_PASSWORDS (?, ?)',
      [upperLimit, lowerLimit ?? null],
    );
    await connection.commit();
    logger.info('📊 Dashboard data retrieved successfully');
    const rawData = records[0].map((record) => {
      return Object.fromEntries(
        Object.entries(record).map(([key, value]) => [
          key.toLowerCase(),
          value,
        ]),
      );
    });
    const dashboardData = dashboardSchema.parse(rawData);
    const html = compileTemplate('dashboard', { data: dashboardData });
    logger.info('📊 Dashboard rendered successfully.');
    logger.info(
      html.slice(0, 300) + (html.length > 300 ? '... [truncated]' : ''),
    );
    return res.status(200).send(html);
  } catch (error: unknown) {
    await connection.rollback();
    return next(error);
  } finally {
    connection.release();
  }
};

export { renderDashboardHandler };
