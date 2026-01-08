import { Router } from "express";
import { sendMail } from '../controllers/mail.controller.js';

const router = Router();

router.get('/send', sendMail);

export { router as mailRouter }; 