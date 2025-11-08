import { describe, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/server';

describe('Security Middleware', () => {
  describe('Security Headers', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/health');

      // Helmet sets various security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
    });
  });

  describe('CORS', () => {
    it('should have CORS headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should set rate limit headers', async () => {
      const response = await request(app).get('/health');

      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
    });
  });
});
