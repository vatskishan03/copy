import { logger } from './config/logger';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load local env for development if present (supports both ".env" and "env" filenames)
(() => {
  const candidates = [
    // When running from server directory
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), 'env'),
    // When running compiled code from dist
    path.join(__dirname, '../.env'),
    path.join(__dirname, '../env'),
    // When running ts-node directly from src
    path.join(__dirname, '.env'),
    path.join(__dirname, 'env'),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file)) {
      dotenv.config({ path: file });
      break;
    }
  }
})();

interface EnvVars {
  DATABASE_URL: string;
  // Use a single REDIS_URL (redis:// or rediss://)
  REDIS_URL: string;
  PORT: string;
  CLIENT_URL: string;
  NODE_ENV: 'development' | 'production';
}

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const baseRequired: (keyof EnvVars)[] = [
  'DATABASE_URL',
  'PORT',
  'CLIENT_URL',
  'NODE_ENV'
];

export function validateEnv(): EnvVars {
  for (const envVar of baseRequired) {
    if (!process.env[envVar]) {
      const error = `Missing required environment variable: ${envVar}`;
      logger.error(error);
      throw new Error(error);
    }
  }

  // Require REDIS_URL exclusively
  if (!process.env.REDIS_URL) {
    const error = 'Missing Redis configuration: provide REDIS_URL (redis:// or rediss://)';
    logger.error(error);
    throw new Error(error);
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    REDIS_URL: process.env.REDIS_URL!,
    PORT: process.env.PORT!,
    CLIENT_URL: clientUrl, 
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development'
  };
}