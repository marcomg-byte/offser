import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import { healthRouter } from './health.routes.js';

const app = express();
app.use(express.json());
app.use('/', healthRouter);

interface HealthResponse {
  status: 'ok';
  timestamp: string;
  localDate: string;
  uptime: number;
}

describe('health.router.ts', () => {
  describe('GET /', () => {
    it('should return 200 OK with health check information', async () => {
      const response = await request(app).get('/');
      const body: HealthResponse = response.body as HealthResponse;

      expect(response.status).toBe(200);
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('timestamp');
      expect(body).toHaveProperty('localDate');
      expect(body).toHaveProperty('uptime');

      expect(typeof body.timestamp).toBe('string');
      expect(typeof body.localDate).toBe('string');
      expect(typeof body.uptime).toBe('number');

      const parsedTimestamp = new Date(body.timestamp);
      expect(parsedTimestamp.toISOString()).toBe(body.timestamp);
    });
  });
});
