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
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD?: string;
  PORT: string;
  CLIENT_URL: string;
  NODE_ENV: 'development' | 'production';
}

const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
const requiredEnvVars: (keyof EnvVars)[] = [
  'DATABASE_URL',
  'REDIS_HOST',
  'REDIS_PORT',
  'PORT',
  'CLIENT_URL',
  'NODE_ENV'
];

export function validateEnv(): EnvVars {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      const error = `Missing required environment variable: ${envVar}`;
      logger.error(error);
      throw new Error(error);
    }
  }

  return {
    DATABASE_URL: process.env.DATABASE_URL!,
    REDIS_HOST: process.env.REDIS_HOST!,
    REDIS_PORT: process.env.REDIS_PORT!,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    PORT: process.env.PORT!,
    CLIENT_URL: clientUrl, 
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development'
  };
}