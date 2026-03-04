import { sendMailHandler } from './mail.controller.js';
import { templateHandler } from './template.controller.js';
import {
  insertDataHandler,
  readDataHandler,
  deleteDataHandler,
  healthCheckHandler as dbHealthCheckHandler,
} from './db.controller.js';
import { renderDashboardHandler } from './app.controller.js';

export {
  renderDashboardHandler,
  sendMailHandler,
  templateHandler,
  insertDataHandler,
  readDataHandler,
  deleteDataHandler,
  dbHealthCheckHandler,
};
