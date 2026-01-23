import { Router } from "express";
import { sendMailHandler } from '../controllers/index.js';

const router = Router();

router.get('/send', sendMailHandler);

export { router as mailRouter }; 