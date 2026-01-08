import { Request, Response } from 'express';

const sendMail = (req: Request, res: Response) => {
    const { to, subject, body  } = req.body;

    if (!to || !subject || !body) {
        return res.status(400).json({ message: 'Missing required field(s): to, subject, body' });
    }

    return res.status(200).send('Mail sent successfully!');
};

export { sendMail };