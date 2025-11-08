import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  jwtSecret: string;
  jwtExpiration: string;
  databaseUrl: string;
}

const getConfig = (): Config => {
  const requiredVars = ['JWT_SECRET', 'DATABASE_URL'];

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT || '3000', 10),
    jwtSecret: process.env.JWT_SECRET!,
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',
    databaseUrl: process.env.DATABASE_URL!,
  };
};

export const config = getConfig();
