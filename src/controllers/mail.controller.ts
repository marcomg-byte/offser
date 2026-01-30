import { Request, Response, NextFunction } from 'express';
import { mailRequestSchema } from '../schemas/index.js';
import { compileTemplate, sendMail } from '../services/index.js';

/**
 * Express route handler for sending emails via POST request.
 *
 * Validates the incoming request body against the mailRequestSchema,
 * then sends the email through the mail service. Supports both direct HTML/text
 * and Handlebars template-based emails. Handles validation and service errors by passing them to the error middleware.
 *
 * @async
 * @param req - Express request object containing email data in body.
 *   Expected body properties: to, subject, text (optional), html (optional), templateName (optional), templateData (optional).
 * @param res - Express response object for sending the JSON response.
 * @param next - Express next function to pass errors to middleware.
 *
 * @returns Sends a 200 JSON response with email details on success, or passes the error to next() for centralized error handling.
 *
 * @throws Does not throw - all errors are caught and passed to next().
 *
 * @example
 * // POST /mail
 * // Body: { to: 'user@example.com', subject: 'Hello', html: '<p>Hi</p>' }
 * // Response: 200 { title: 'Email Sent Successfully!', data: {...}, mailResponse: {...} }
 *
 * @example
 * // POST /mail
 * // Body: { to: 'user@example.com', subject: 'Welcome', templateName: 'welcome', templateData: { name: 'John' } }
 * // Response: 200 { title: 'Email Sent Successfully!', data: {...}, mailResponse: {...} }
 */
const sendMailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = mailRequestSchema.parse(req.body);
    const { to, subject, text, html, templateName, templateData } = data;
    const responseTitle = 'Email Sent Successfully!';

    let finalHtml = html;

    if (templateName) {
      finalHtml = compileTemplate(templateName, templateData || {});
    }

    const mailResponse = await sendMail({
      to,
      subject,
      text,
      html: finalHtml,
    });

    console.log(`✅ ${responseTitle}:`);
    console.dir(mailResponse, { depth: 5, colors: true });
    return res.status(200).json({ title: responseTitle, data, mailResponse });
  } catch (error: unknown) {
    return next(error);
  }
};

export { sendMailHandler };
