import http from 'http';
import https from 'https';
import { logger, extractErrorInfo } from '../utils/index.js';

/**
 * Handles graceful shutdown of the server upon receiving a termination signal.
 *
 * Stops accepting new connections, waits for existing requests to finish,
 * flushes logs, and exits the process. If shutdown takes too long, forces exit.
 *
 * @param server - The HTTP or HTTPS server instance to shut down.
 * @param signal - The signal that triggered the shutdown (e.g., 'SIGTERM', 'SIGINT').
 */
function gracefulShutdown(
  server: http.Server | https.Server,
  signal: string,
): void {
  logger.info(`❗ ${signal} received, starting graceful shutdown...`);

  server.close((error) => {
    if (error) {
      const errorInfo = extractErrorInfo(error);
      logger.error({ errorInfo }, 'Error during server shutdown');
      process.exit(1);
    }

    logger.info('⏹️  Server closed gracefully');
    logger.flush();

    process.exit(0);
  });

  const shutdownTimeout = setTimeout(() => {
    logger.error('⏰ Shutdown timeout exceeded, forcing exit');
    process.exit(1);
  }, 30000);

  shutdownTimeout.unref();
}

export { gracefulShutdown };
