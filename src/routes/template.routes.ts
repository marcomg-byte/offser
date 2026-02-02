import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { env } from '../config/env.js';
import { templateHandler } from '../controllers/index.js';

const { RENDER_SERVICE_RATE_LIMIT, RENDER_SERVICE_RATE_WINDOW } = env;

const router = Router();

const renderDelimiter = rateLimit({
  windowMs: RENDER_SERVICE_RATE_WINDOW * 60 * 1000,
  limit: RENDER_SERVICE_RATE_LIMIT,
  message: 'Too many render requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.get('/:templateName', renderDelimiter, templateHandler);

export { router as templateRouter };
