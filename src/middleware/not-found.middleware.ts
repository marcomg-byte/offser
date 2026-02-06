import { Request, Response } from 'express';
import { logger } from '../utils/index.js';
import { compileTemplate } from '../services/index.js';

/**
 * Middleware to handle 404 Not Found errors for unmatched routes.
 *
 * Renders an HTML page using the 'not-found' template and logs the request.
 * Should be registered after all valid routes and before the error handler.
 *
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns {Response} 404 HTML response.
 */
function notFoundHandler(req: Request, res: Response) {
  const path = req.originalUrl || req.url;
  const html = compileTemplate('not-found', {});

  logger.warn(
    { request: { path, method: req.method } },
    `🚫 404 Not Found: ${path}`,
  );
  return res.status(404).send(html);
}

export { notFoundHandler };
