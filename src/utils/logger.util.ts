import pino, { multistream } from 'pino';
import pretty from 'pino-pretty';
import fs from 'fs';

const LOGS_DIR = './logs';

/** Ensure the logs directory exists */
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * prettyTransport configuration for terminal logging:
 * Uses pino-pretty to format logs with color and disables built-in time translation.
 * - colorize: Enables colored output for better readability in the terminal.
 * - translateTime: Disabled to allow custom timestamp formatting via pino options.
 * - sync: Ensures synchronous logging for immediate output.
 */
const prettyTransport = pretty({
  colorize: true,
  translateTime: false,
  sync: true,
});

/**
 * Streams configuration for pino multistream:
 * - prettyTransport: pretty-prints logs to the terminal using pino-pretty.
 * - error.log: writes error-level logs in JSON format to logs/error.log.
 * - info.log: writes info-level logs in JSON format to logs/info.log.
 * - warn.log: writes warn-level logs in JSON format to logs/warn.log.
 * - debug.log: writes debug-level logs in JSON format to logs/debug.log.
 *
 * Note: Only the terminal output uses pino-pretty for human-readable logs.
 *       Log files remain in JSON format for easier parsing and processing.
 */
const streams: pino.StreamEntry[] = [
  { stream: prettyTransport },
  {
    level: 'error',
    stream: fs.createWriteStream(`${LOGS_DIR}/error.log`, { flags: 'a' }),
  },
  {
    level: 'info',
    stream: fs.createWriteStream(`${LOGS_DIR}/info.log`, { flags: 'a' }),
  },
  {
    level: 'warn',
    stream: fs.createWriteStream(`${LOGS_DIR}/warn.log`, { flags: 'a' }),
  },
  {
    level: 'debug',
    stream: fs.createWriteStream(`${LOGS_DIR}/debug.log`, { flags: 'a' }),
  },
];

/**
 * Pino logger instance with multistream output.
 *
 * Configuration:
 * - Logs all levels (debug, info, warn, error) for comprehensive visibility.
 * - Log level output is uppercase for consistency.
 * - Timestamp format: 'MM/DD/YYYY HH:mm:ss' (en-US locale), with a space separator for clarity.
 * - Uses pino-pretty for terminal output, supporting color and emoji rendering.
 * - Writes structured JSON logs to separate files for error, info, warn, and debug levels.
 */
const logger = pino(
  {
    level: 'debug',
    formatters: {
      level(label) {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: () => {
      const date = new Date();
      const day =
        date.getDate() < 10 ? `0${date.getDate()}` : date.getDate().toString();
      const month =
        date.getMonth() + 1 < 10
          ? `0${date.getMonth() + 1}`
          : (date.getMonth() + 1).toString();
      const year = date.getFullYear();
      const hours =
        date.getHours() < 10
          ? `0${date.getHours()}`
          : date.getHours().toString();
      const minutes =
        date.getMinutes() < 10
          ? `0${date.getMinutes()}`
          : date.getMinutes().toString();
      const seconds =
        date.getSeconds() < 10
          ? `0${date.getSeconds()}`
          : date.getSeconds().toString();
      return `,"time":"${month}/${day}/${year} ${hours}:${minutes}:${seconds}"`;
    },
  },
  multistream(streams),
);

export { logger };
