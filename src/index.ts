import 'dotenv/config';
import express from 'express';
import { mailRouter, templateRouter } from './routes/index.js';
import {
  verifyConnection as verifyMailConnection,
  preloadTemplates,
} from './services/index.js';
import { errorHandler } from './middleware/index.js';
import { extractErrorInfo, logError } from './utils/index.js';
import { CertificateNotFoundError } from './errors/index.js';
import { env } from './config/env.js';
import https from 'https';
import fs from 'fs';

const app = express();
const { PORT, NODE_ENV, HTTPS_ENABLED, HTTPS_CERT_PATH, HTTPS_KEY_PATH } = env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));

app.use('/mail', mailRouter);
app.use('/render', templateRouter);
app.use(errorHandler);

/**
 * Preloads all templates and logs the result.
 *
 * If preloading fails, logs the error and exits the process.
 */
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

/**
 * Creates and returns an HTTPS server using the provided certificate and key files.
 *
 * Checks for the existence of the certificate and key files before attempting to create the server.
 * Throws a CertificateNotFoundError if either file is missing.
 * Logs and exits the process if any error occurs during server creation.
 *
 * @returns {https.Server} The created HTTPS server instance.
 * @throws {CertificateNotFoundError} If the certificate or key files are not found.
 */
const createHttpsServer = (): https.Server => {
  try {
    const certExists = fs.existsSync(HTTPS_CERT_PATH);
    const keyExists = fs.existsSync(HTTPS_KEY_PATH);

    if (!certExists || !keyExists) {
      throw new CertificateNotFoundError(HTTPS_CERT_PATH, HTTPS_KEY_PATH);
    }

    const key = fs.readFileSync(HTTPS_KEY_PATH, 'utf8');
    const cert = fs.readFileSync(HTTPS_CERT_PATH, 'utf8');

    return https.createServer({ key, cert }, app);
  } catch (error: unknown) {
    const errorInfo = extractErrorInfo(error);
    logError(errorInfo, 'Failed to Create HTTPS Server');
    process.exit(1);
  }
};

/**
 * Callback executed when the server starts listening.
 *
 * Logs the server status, protocol (HTTP/HTTPS), and environment mode.
 * Preloads templates in production and verifies the mail service connection.
 * If mail service verification fails, logs the error and exits the process.
 */
const onServerStart = (): void => {
  console.log(`🚀 Server is Running on Port ${PORT}`);

  if (HTTPS_ENABLED) {
    console.log('🔐 Using HTTPS');
  } else {
    console.log('🔓 Using HTTP');
  }

  if (NODE_ENV === 'PRODUCTION') {
    preloadTemplateService();
    console.log('🔒 Running in Production Mode');
  } else {
    console.log('🛠️  Running in Development Mode');
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
};

/**
 * Starts the Express server using HTTPS if enabled, otherwise falls back to HTTP.
 *
 * Checks the HTTPS_ENABLED environment variable to determine which protocol to use.
 * If HTTPS is enabled, creates and starts an HTTPS server with the provided certificate and key.
 * Otherwise, starts a standard HTTP server.
 */
const startServer = (): void => {
  if (HTTPS_ENABLED) {
    const httpsServer = createHttpsServer();
    httpsServer.listen(PORT, onServerStart);
  } else {
    app.listen(PORT, onServerStart);
  }
};

startServer();
