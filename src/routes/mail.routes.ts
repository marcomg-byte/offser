import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { sendMailHandler } from '../controllers/index.js';
import { env } from '../config/env.js';

const router = Router();
const { MAIL_SERVICE_RATE_LIMIT, MAIL_SERVICE_RATE_WINDOW } = env;

const emailLimiter = rateLimit({
  windowMs: MAIL_SERVICE_RATE_WINDOW * 60 * 1000,
  limit: MAIL_SERVICE_RATE_LIMIT,
  message: 'Too many email requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/send', emailLimiter, sendMailHandler);

export { router as mailRouter };
