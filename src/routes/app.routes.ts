import { Router } from 'express';
import { renderDashboardHandler } from '../controllers/index.js';

const router = Router();

router.get('/dashboard', renderDashboardHandler);

export { router as appRouter };
