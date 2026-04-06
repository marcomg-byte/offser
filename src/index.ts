import 'dotenv/config';
import express from 'express';
import {
  appRouter,
  dbRouter,
  healthRouter,
  mailRouter,
  templateRouter,
} from './routes/index.js';
import {
  verifyConnection as verifyMailConnection,
  verifyDBConnection,
  preloadTemplates,
} from './services/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';
import { extractErrorInfo, gracefulShutdown, logger } from './utils/index.js';
import { CertificateNotFoundError } from './errors/index.js';
import { env } from './config/env.js';
import { execSync } from 'child_process';
import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

/** Sets the console code page to UTF-8 on Windows for proper encoding */
if (process.platform === 'win32') {
  try {
    execSync('chcp 65001', { stdio: 'ignore' });
  } catch (error: unknown) {
    const errorInfo = extractErrorInfo(error);
    logger.error({ errorInfo }, 'Failed to set console to UTF-8 encoding');
  }
}

const app = express();
const {
  PORT,
  NODE_ENV,
  HTTPS_ENABLED,
  HTTPS_CERT_PATH,
  HTTPS_KEY_PATH,
  SMTP_SECURE,
  DB_SSL_ENABLED,
} = env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: 'text/*' }));
app.use('/assets', express.static(path.join(process.cwd(), 'assets')));
app.use('/app', appRouter);
app.use('/health', healthRouter);
app.use('/records', dbRouter);
app.use('/mail', mailRouter);
app.use('/render', templateRouter);
app.use(notFoundHandler);
app.use(errorHandler);

/**
 * Preloads all templates and logs the result.
 *
 * If preloading fails, logs the error and exits the process.
 */
const preloadTemplateService = (): void => {
  try {
    const templatesLoaded = preloadTemplates();
    logger.info(`📄 Preloaded ${templatesLoaded} templates.`);
  } catch (error: unknown) {
    const errorInfo = extractErrorInfo(error);
    logger.error({ errorInfo }, 'Failed to Preload Templates');
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
    logger.error({ errorInfo }, 'Failed to Create HTTPS Server');
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
  logger.info(`🚀 Server is Running on Port ${PORT}`);
  logger.warn(
    'This tool is for authorized security testing only. Unauthorized use is illegal.',
  );

  if (HTTPS_ENABLED) {
    logger.info('🔐 Using HTTPS');
  } else {
    logger.info('🔓 Using HTTP');
  }

  if (NODE_ENV === 'PRODUCTION') {
    preloadTemplateService();
    logger.info('🔒 Running in Production Mode');
  } else {
    logger.info('🛠️  Running in Development Mode');
  }

  verifyDBConnection()
    .then((connection) => {
      if (connection) {
        logger.info(
          `${DB_SSL_ENABLED ? '🔐 SSL' : '🔓 Non-SSL'} Database Transport Layer Created`,
        );
        logger.info('💾 Database Service Connected Successfully');
        return;
      }

      logger.error('❌ Failed to Verify Database Connection');
      process.exit(1);
    })
    .catch((error) => {
      const errorInfo = extractErrorInfo(error);
      logger.error({ errorInfo }, 'Failed to Verify Database Connection');
      process.exit(1);
    });

  verifyMailConnection()
    .then((connection) => {
      if (connection) {
        logger.info(
          `${SMTP_SECURE ? '🔐 SSL' : '🔓 Non-SSL'} SMTP Transporter Created Successfully`,
        );
        logger.info('📧 Mail Service Connected Successfully');
        return;
      }

      logger.error('❌ Failed to Verify Mail Service Connection');
      process.exit(1);
    })
    .catch((error) => {
      const errorInfo = extractErrorInfo(error);
      logger.error({ errorInfo }, 'Failed to Start Mail Service');
      process.exit(1);
    });
};

/**
 * Starts the HTTP or HTTPS server based on environment configuration.
 *
 * Chooses HTTPS if enabled and certificates are present, otherwise falls back to HTTP.
 * Binds the server to the configured port and executes the onServerStart callback.
 *
 * @returns {http.Server | https.Server} The created server instance (HTTP or HTTPS).
 */
const startServer = (): http.Server | https.Server => {
  let server: http.Server | https.Server;

  if (HTTPS_ENABLED) {
    server = createHttpsServer();
  } else {
    server = http.createServer(app);
  }

  server.listen(PORT, onServerStart);

  return server;
};

const server = startServer();

process.on('SIGTERM', () => gracefulShutdown(server, 'SIGTERM'));
process.on('SIGINT', () => gracefulShutdown(server, 'SIGINT'));

process.on('uncaughtException', (error) => {
  const errorInfo = extractErrorInfo(error);
  logger.fatal({ errorInfo }, 'Uncaught Exception, forcing shutdown...');
  gracefulShutdown(server, 'UNCAUGHT_EXCEPTION');
});

process.on('unhandledRejection', (reason, promise) => {
  const errorInfo = extractErrorInfo(reason);
  logger.fatal(
    { reason: errorInfo, promise },
    'Unhandled Rejection, forcing shutdown...',
  );
  gracefulShutdown(server, 'UNHANDLED_REJECTION');
});
