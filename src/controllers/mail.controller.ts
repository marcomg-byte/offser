import { Request, Response, NextFunction } from 'express';
import { mailRequestSchema } from '../schemas/mail.schema.js';
import { ZodError } from 'zod';
import { sendMail } from '../services/mail.service.js';

const sendMailHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = mailRequestSchema.parse(req.body);
        const { to, subject, text, html } = data;
        const responseTitle = 'Email Sent Successfully!';

        console.log('✅ Valid Email Data:');
        console.dir(data, { depth: 5, colors: true });

        const mailResponse = await sendMail({
            to,
            subject,
            text,
            html
        });

        console.log(`✅ ${responseTitle}:`);
        console.dir(mailResponse, { depth: 5, colors: true });
        return res.status(200).json({ title: responseTitle, data, mailResponse });
    } catch (err: unknown) {
        let errorTitle = '';
        if (err instanceof ZodError) {
            errorTitle = 'Request Validation Failed';
        } else if (err instanceof Error) {
            errorTitle = 'Email Sending Failed';
        } else {
            errorTitle = 'Unknown Error Occurred While Sending Email';
        }
        return next({ error: err, errorTitle });
    }
};

export { sendMailHandler };