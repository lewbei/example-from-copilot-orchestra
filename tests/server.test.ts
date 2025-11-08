import { describe, it, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import { app, server } from '../src/server';

describe('Server', () => {
  afterAll((done) => {
    server.close(done);
  });

  it('should respond to health check endpoint', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/unknown-route');

    expect(response.status).toBe(404);
  });
});
