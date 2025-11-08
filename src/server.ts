import express, { Request, Response } from 'express';
import { config } from './config/env';
import { initializeDatabase } from './config/database';

export const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
  });
});

// Start server
export const server = app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port} in ${config.nodeEnv} mode`);
  
  // Initialize database in non-test environments
  if (config.nodeEnv !== 'test') {
    try {
      await initializeDatabase();
    } catch (error) {
      console.error('Failed to initialize database:', error);
    }
  }
});
