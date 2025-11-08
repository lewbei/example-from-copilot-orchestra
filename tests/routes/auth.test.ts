import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import { app } from '../../src/server';
import { pool, initializeDatabase, closeDatabase } from '../../src/config/database';

describe('Auth Routes', () => {
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
      await initializeDatabase();
      // Clean up test data
      await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@authtest.com']);
    } catch (error) {
      console.log('Database not available, skipping auth route tests');
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      // Clean up test data
      await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@authtest.com']);
      await closeDatabase();
    }
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const response = await request(app).post('/api/auth/register').send({
        email: 'newuser@authtest.com',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', 'newuser@authtest.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
    });

    it('should reject registration with duplicate email', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const email = 'duplicate@authtest.com';
      const password = 'SecurePass123!';

      // Create first user
      await request(app).post('/api/auth/register').send({ email, password });

      // Try to create duplicate
      const response = await request(app).post('/api/auth/register').send({ email, password });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'invalid-email',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@authtest.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject registration with missing fields', async () => {
      const response = await request(app).post('/api/auth/register').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      if (!dbAvailable) return;

      // Create a test user for login tests
      await request(app).post('/api/auth/register').send({
        email: 'loginuser@authtest.com',
        password: 'SecurePass123!',
      });
    });

    it('should login successfully with correct credentials', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const response = await request(app).post('/api/auth/login').send({
        email: 'loginuser@authtest.com',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('email', 'loginuser@authtest.com');
      expect(response.body.user).not.toHaveProperty('password_hash');
      expect(typeof response.body.token).toBe('string');
    });

    it('should reject login with wrong password', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const response = await request(app).post('/api/auth/login').send({
        email: 'loginuser@authtest.com',
        password: 'WrongPassword123!',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with non-existent user', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const response = await request(app).post('/api/auth/login').send({
        email: 'nonexistent@authtest.com',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject login with invalid email format', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'invalid-email',
        password: 'SecurePass123!',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('errors');
    });
  });
});
