import { logger } from './config/logger';

interface EnvVars {
  DATABASE_URL: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  REDIS_PASSWORD?: string;
  PORT: string;
  CLIENT_URL: string;
  NODE_ENV: 'development' | 'production';
}

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
    CLIENT_URL: process.env.CLIENT_URL!,
    NODE_ENV: (process.env.NODE_ENV as 'development' | 'production') || 'development'
  };
}