import 'dotenv/config';
import express from 'express';
import { mailRouter, templateRouter } from './routes/index.js';
import {
  verifyConnection as verifyMailConnection,
  preloadTemplates,
} from './services/index.js';
import { errorHandler } from './middleware/index.js';
import { extractErrorInfo, logError } from './utils/index.js';
import { env } from './config/env.js';

const app = express();
const { PORT, NODE_ENV } = env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

app.use('/mail', mailRouter);
app.use('/render', templateRouter);
app.use(errorHandler);

const preloadTemplateService = (): void => {
  try {
    const templatesLoaded = preloadTemplates();
    console.log(`📄 Preloaded ${templatesLoaded} templates.`);
  } catch (error: unknown) {
    const errorInfo = extractErrorInfo(error);
    logError(errorInfo, 'Failed to Preload Templates');
    process.exit(1);
  }
};

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);

  if (NODE_ENV === 'PRODUCTION') {
    preloadTemplateService();
    console.log('🔒 Running in production mode');
  } else {
    console.log('🛠️  Running in development mode');
  }

  verifyMailConnection()
    .then((connection) => {
      if (connection) {
        console.log('📧 Mail Service Connected Successfully');
        return;
      }

      console.log('❌ Failed to Verify Mail Service Connection');
      process.exit(1);
    })
    .catch((error) => {
      const errorInfo = extractErrorInfo(error);
      logError(errorInfo, 'Failed to Start Mail Service');
      process.exit(1);
    });
});
