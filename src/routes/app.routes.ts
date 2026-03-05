import { Router } from 'express';
import { renderDashboardHandler } from '../controllers/index.js';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';

const { RENDER_SERVICE_RATE_LIMIT, RENDER_SERVICE_RATE_WINDOW } = env;

const router = Router();

const renderDelimiter = rateLimit({
  windowMs: RENDER_SERVICE_RATE_WINDOW * 60 * 1000,
  limit: RENDER_SERVICE_RATE_LIMIT,
  message: 'Too many render requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/dashboard', renderDelimiter, renderDashboardHandler);

export { router as appRouter };
