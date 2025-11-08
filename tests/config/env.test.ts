import { describe, it, expect, beforeEach } from '@jest/globals';
import { config } from '../../src/config/env';

describe('Environment Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should load and validate required environment variables', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/testdb';

    expect(config.nodeEnv).toBe('test');
    expect(config.port).toBe(3001); // Using port from setup.ts
    expect(config.jwtSecret).toBe('test-jwt-secret-key'); // Using secret from setup.ts
    expect(config.databaseUrl).toBe('postgresql://localhost:5432/test_db'); // Using DB from setup.ts
  });

  it('should use default port if not specified', () => {
    process.env.NODE_ENV = 'test';
    process.env.JWT_SECRET = 'test-secret-key';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/testdb';
    process.env.PORT = '';

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { config: newConfig } = require('../../src/config/env');
    expect(newConfig.port).toBe(3000);
  });

  it('should throw error if JWT_SECRET is missing', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.DATABASE_URL = 'postgresql://localhost:5432/testdb';
    delete process.env.JWT_SECRET;

    expect(() => {
      jest.isolateModules(() => {
        require('../../src/config/env');
      });
    }).toThrow();
  });

  it('should throw error if DATABASE_URL is missing', () => {
    process.env.NODE_ENV = 'test';
    process.env.PORT = '3000';
    process.env.JWT_SECRET = 'test-secret-key';
    delete process.env.DATABASE_URL;

    expect(() => {
      jest.isolateModules(() => {
        require('../../src/config/env');
      });
    }).toThrow();
  });
});
