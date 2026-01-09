import { Router } from "express";
import { sendMailHandler } from '../controllers/mail.controller.js';

const router = Router();

router.get('/send', sendMailHandler);

export { router as mailRouter }; 