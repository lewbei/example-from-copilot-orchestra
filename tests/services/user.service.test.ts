import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { pool, initializeDatabase, closeDatabase } from '../../src/config/database';
import { createUser, findUserByEmail } from '../../src/services/user.service';

describe('User Service', () => {
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
      await initializeDatabase();
      // Clean up test data
      await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@test.com']);
    } catch (error) {
      console.log('Database not available, skipping user service tests');
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      // Clean up test data
      await pool.query('DELETE FROM users WHERE email LIKE $1', ['%@test.com']);
      await closeDatabase();
    }
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const email = 'newuser@test.com';
      const passwordHash = 'hashed_password_123';

      const user = await createUser({ email, password_hash: passwordHash });

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user.email).toBe(email);
      expect(user.password_hash).toBe(passwordHash);
      expect(user.created_at).toBeDefined();
      expect(user.updated_at).toBeDefined();
    });

    it('should throw error when creating user with duplicate email', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const email = 'duplicate@test.com';
      const passwordHash = 'hashed_password_123';

      await createUser({ email, password_hash: passwordHash });

      await expect(createUser({ email, password_hash: 'different_hash' })).rejects.toThrow();
    });
  });

  describe('findUserByEmail', () => {
    it('should find an existing user by email', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const email = 'findme@test.com';
      const passwordHash = 'hashed_password_123';

      await createUser({ email, password_hash: passwordHash });
      const user = await findUserByEmail(email);

      expect(user).toBeDefined();
      expect(user?.email).toBe(email);
      expect(user?.password_hash).toBe(passwordHash);
    });

    it('should return null for non-existent user', async () => {
      if (!dbAvailable) {
        console.log('Skipping: Database not available');
        return;
      }

      const user = await findUserByEmail('nonexistent@test.com');
      expect(user).toBeNull();
    });
  });
});
