import 'dotenv/config';
import express from 'express';
import { mailRouter } from './routes/mail.routes.js';
import { verifyConnection } from './services/mail.service.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

app.use('/mail', mailRouter);

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    const connection = await verifyConnection();

    if (connection) {
        console.log('📧 Mail service is ready to send emails!');
    }
});