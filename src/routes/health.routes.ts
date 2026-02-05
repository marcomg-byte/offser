import { Router, Request, Response } from 'express';
import { formatDate, logger } from '../utils/index.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  const date = new Date();
  const info = {
    status: 'ok',
    timestamp: date.toISOString(),
    localDate: formatDate(date),
    uptime: Number(process.uptime().toFixed(2)),
  };
  logger.info({ info }, '❤️‍🩹 Health check requested');
  return res.status(200).json(info);
});

export { router as healthRouter };
