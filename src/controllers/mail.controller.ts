import { Request, Response } from 'express';
import { mailRequestSchema } from '../schemas/mail.schema.js';
import { ZodError } from 'zod';
import { sendMail } from '../services/mail.service.js';

const sendMailHandler = async (req: Request, res: Response) => {
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
    } catch (err: Error | unknown) {
        if (err instanceof ZodError) {
            const error = err as ZodError;
            const errorTitle = 'Request Validation Errors';
            const errorInfo = {
                cause: error?.cause,
                issues: error.issues,
                message: error.message,
                name: error.name,
                stack: error?.stack,
                type: error.type
            };
            console.error(`❌ ${errorTitle}:`);
            console.dir(errorInfo, { depth: 5, colors: true });
            return res.status(400).json({ title: errorTitle, ...errorInfo });
        }

        const error = err as Error;
        const errorTitle = 'Error Sending Email';
        const errorInfo = {
            cause: error?.cause,
            message: error.message,
            name: error.name,
            stack: error?.stack
        };
        console.error(`❌ ${errorTitle}:`);
        console.dir(errorInfo, { depth: 5, colors: true });
        return res.status(500).json({ title: errorTitle, ...errorInfo });
    }
};

export { sendMailHandler };