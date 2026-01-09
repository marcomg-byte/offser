import { Request, Response, NextFunction } from 'express';
import { sendMail } from '../services/mail.service.js';

const sendMailHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { to, subject, text, html  } = req.body;

    if (!to) {
        return res.status(400).json({ message: 'Missing required field: "to"' });
    }

    if(!subject) {
        return res.status(400).json({ message: 'Missing required field: "subject"' });
    }

    try {
        const mailResponse = await sendMail({
            to,
            subject,
            text,
            html
        });
        res.status(200).json({ message: 'Email sent successfully', info: mailResponse });
    } catch (error: Error | unknown) {
        return next(error);
    }
};

export { sendMailHandler };