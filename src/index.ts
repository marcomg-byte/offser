import 'dotenv/config';
import express from 'express';
import { mailRouter } from './routes/index.js';
import { verifyConnection } from './services/index.js';
import { errorHandler } from './middleware/index.js';
import { env } from './config/env.js';

const app = express();
const { PORT } = env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

app.use('/mail', mailRouter);
app.use(errorHandler);

const startMailService = async () => {
    const connection = await verifyConnection();

    if (connection) {
        return Promise.resolve('📧 Mail service is ready to send emails!');
    } else {
        throw new Error('❌ Failed to start mail service. Please check the configuration.');
    }
}

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    startMailService()
    .then((message) => console.log(message))
    .catch((error) => console.error(error));
});