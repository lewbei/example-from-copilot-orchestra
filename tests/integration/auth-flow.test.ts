import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/server';
import { pool, initializeDatabase, closeDatabase } from '../../src/config/database';

describe('Complete Authentication Flow', () => {
  let dbAvailable = false;
  const testEmail = 'integration@test.com';
  const testPassword = 'IntegrationTest123!';

  beforeAll(async () => {
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
      await initializeDatabase();
      // Clean up any existing test data
      await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
    } catch (error) {
      console.log('Database not available, skipping integration tests');
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      // Clean up test data
      await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
      await closeDatabase();
    }
  });

  it('should complete full user journey: register -> login -> access protected route', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }

    // Step 1: Register a new user
    const registerResponse = await request(app).post('/api/auth/register').send({
      email: testEmail,
      password: testPassword,
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body).toHaveProperty('user');
    expect(registerResponse.body.user).toHaveProperty('email', testEmail);
    const userId = registerResponse.body.user.id;

    // Step 2: Login with the new user
    const loginResponse = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
    expect(loginResponse.body).toHaveProperty('user');
    expect(loginResponse.body.user).toHaveProperty('id', userId);
    const token = loginResponse.body.token;

    // Step 3: Access protected route with token
    const profileResponse = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body).toHaveProperty('user');
    expect(profileResponse.body.user).toHaveProperty('userId', userId);
    expect(profileResponse.body.user).toHaveProperty('email', testEmail);

    // Step 4: Verify protected route denies access without token
    const unauthorizedResponse = await request(app).get('/api/users/profile');

    expect(unauthorizedResponse.status).toBe(401);
  });

  it('should handle concurrent registration attempts gracefully', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }

    const concurrentEmail = 'concurrent@test.com';
    const password = 'ConcurrentTest123!';

    // Clean up any existing data
    await pool.query('DELETE FROM users WHERE email = $1', [concurrentEmail]);

    // Attempt concurrent registrations
    const promises = [
      request(app).post('/api/auth/register').send({ email: concurrentEmail, password }),
      request(app).post('/api/auth/register').send({ email: concurrentEmail, password }),
      request(app).post('/api/auth/register').send({ email: concurrentEmail, password }),
    ];

    const responses = await Promise.all(promises);

    // One should succeed (201), others should fail (400 or 500)
    const successCount = responses.filter((r) => r.status === 201).length;
    const failCount = responses.filter((r) => r.status === 400 || r.status === 500).length;

    expect(successCount).toBe(1);
    expect(failCount).toBe(2);

    // Clean up
    await pool.query('DELETE FROM users WHERE email = $1', [concurrentEmail]);
  });
});
