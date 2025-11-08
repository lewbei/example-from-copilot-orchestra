import { pool } from '../config/database';
import { User, CreateUserData } from '../models/User';

export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { email, password_hash } = userData;

  const result = await pool.query<User>(
    `INSERT INTO users (email, password_hash, created_at, updated_at)
     VALUES ($1, $2, NOW(), NOW())
     RETURNING id, email, password_hash, created_at, updated_at`,
    [email, password_hash]
  );

  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await pool.query<User>(
    'SELECT id, email, password_hash, created_at, updated_at FROM users WHERE email = $1',
    [email]
  );

  return result.rows[0] || null;
};
