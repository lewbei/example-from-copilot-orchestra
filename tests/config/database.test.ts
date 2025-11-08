import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { pool, initializeDatabase, closeDatabase } from '../../src/config/database';

describe('Database Connection', () => {
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
    } catch (error) {
      console.log('Database not available, skipping database tests');
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      await closeDatabase();
    }
  });

  it('should successfully connect to the database', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }
    
    const client = await pool.connect();
    expect(client).toBeDefined();
    client.release();
  });

  it('should execute a simple query', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }
    
    const result = await pool.query('SELECT NOW()');
    expect(result.rows).toHaveLength(1);
    expect(result.rows[0]).toHaveProperty('now');
  });
});

describe('Database Initialization', () => {
  let dbAvailable = false;

  beforeAll(async () => {
    try {
      await pool.query('SELECT 1');
      dbAvailable = true;
      await initializeDatabase();
    } catch (error) {
      console.log('Database not available, skipping initialization tests');
    }
  });

  afterAll(async () => {
    if (dbAvailable) {
      await closeDatabase();
    }
  });

  it('should create users table with correct schema', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }
    
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position;
    `);

    expect(result.rows.length).toBeGreaterThan(0);
    
    const columns = result.rows.map((row: any) => ({
      name: row.column_name,
      type: row.data_type,
      nullable: row.is_nullable,
    }));

    expect(columns).toContainEqual(
      expect.objectContaining({ name: 'id', nullable: 'NO' })
    );
    expect(columns).toContainEqual(
      expect.objectContaining({ name: 'email', nullable: 'NO' })
    );
    expect(columns).toContainEqual(
      expect.objectContaining({ name: 'password_hash', nullable: 'NO' })
    );
    expect(columns).toContainEqual(
      expect.objectContaining({ name: 'created_at', nullable: 'NO' })
    );
    expect(columns).toContainEqual(
      expect.objectContaining({ name: 'updated_at', nullable: 'NO' })
    );
  });

  it('should have unique constraint on email', async () => {
    if (!dbAvailable) {
      console.log('Skipping: Database not available');
      return;
    }
    
    const result = await pool.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users' AND constraint_type = 'UNIQUE';
    `);

    expect(result.rows.length).toBeGreaterThan(0);
  });
});
