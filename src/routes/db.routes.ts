import { Router } from 'express';
import {
  insertDataHandler,
  dbHealthCheckHandler,
  readDataHandler,
  deleteDataHandler,
} from '../controllers/index.js';

const router = Router();

router.post('/insert', insertDataHandler);
router.get('/read', readDataHandler);
router.delete('/delete', deleteDataHandler);
router.get('/health', dbHealthCheckHandler);

export { router as dbRouter };
