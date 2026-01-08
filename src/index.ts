import 'dotenv/config';
import express from 'express';
import { mailRouter } from './routes/mail.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/mail', mailRouter);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});