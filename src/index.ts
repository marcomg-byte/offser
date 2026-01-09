import 'dotenv/config';
import express from 'express';
import { mailRouter } from './routes/mail.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { verifyConnection } from './services/mail.service.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/mail', mailRouter);
app.use(errorHandler);

app.listen(PORT, async () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    const connection = await verifyConnection();

    if (connection) {
        console.log('📧 Mail service is ready to send emails!');
    }
});