import { Request, Response, NextFunction } from 'express';
import { mailRequestSchema } from '../schemas/index.js';
import { ZodError } from 'zod';
import { sendMail } from '../services/index.js';

/**
 * Express route handler for sending emails via POST request.
 * 
 * Validates the incoming request body against the mailRequestSchema,
 * then sends the email through the mail service. Handles validation and
 * service errors by passing them to the error middleware.
 * 
 * @async
 * @param {Request} req - Express request object containing email data in body.
 *        Expected body properties: to, subject, text (optional), html (optional).
 * @param {Response} res - Express response object for sending the JSON response.
 * @param {NextFunction} next - Express next function to pass errors to middleware.
 * 
 * @returns {void} Sends a 200 JSON response with email details on success,
 *         or passes the error to next() for centralized error handling.
 * 
 * @throws Does not throw - all errors are caught and passed to next().
 * 
 * Passes the following to next():
 * - Zod validation errors → errorTitle: 'Request Validation Failed'
 * - Standard errors → errorTitle: 'Email Sending Failed'
 * - Unknown errors → errorTitle: 'Unknown Error Occurred While Sending Email'
 * 
 * @example
 * // POST /mail
 * // Body: { to: 'user@example.com', subject: 'Hello', html: '<p>Hi</p>' }
 * // Response: 200 { title: 'Email Sent Successfully!', data: {...}, mailResponse: {...} }
 */
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