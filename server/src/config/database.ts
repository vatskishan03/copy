import { Prisma, PrismaClient } from '@prisma/client';
import { Redis, RedisOptions } from 'ioredis';
import { logger } from './logger';
import { TLSSocket } from 'tls';
import { validateEnv } from '../env';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;
  private redis: Redis;

  private constructor() {
    // Ensure env vars are loaded even if this module is imported before app.ts
    const env = validateEnv();

    this.prisma = new PrismaClient({
      log:
        env.NODE_ENV === 'production'
          ? [
              { level: 'warn', emit: 'event' },
              { level: 'error', emit: 'event' },
            ]
          : [
              { level: 'warn', emit: 'event' },
              { level: 'error', emit: 'event' },
              { level: 'info', emit: 'event' },
              { level: 'query', emit: 'event' },
            ],
    });

    const fromUrl = new URL(env.REDIS_URL);
    const isRediss = fromUrl.protocol === 'rediss:';

    const redisConfig: RedisOptions = {
      host: fromUrl.hostname,
      port: parseInt(fromUrl.port || '6379'),
      username: fromUrl.username || 'default',
      password: fromUrl.password || undefined,
      connectTimeout: 7000,
      commandTimeout: 3000,
      maxRetriesPerRequest: 2,
      retryStrategy: (times) => Math.min(times * 50, 1500),
      enableAutoPipelining: true,
      enableOfflineQueue: true,
      lazyConnect: true,
      family: 4,
      ...(isRediss
        ? {
            tls: {
              servername: fromUrl.hostname,
              minVersion: 'TLSv1.2',
              rejectUnauthorized: env.NODE_ENV !== 'development',
            },
          }
        : {}),
    };

    // Do not force TLS via env; respect only the URL scheme


    if (env.NODE_ENV !== 'production') {
      logger.info('Redis connection config', {
        host: redisConfig.host,
        port: redisConfig.port,
        tls: Boolean((redisConfig as any).tls),
      });
    }

    this.redis = new Redis(redisConfig);

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    
    (this.prisma.$on as any)('query', (e: any) => {
      logger.debug('Prisma Query:', e);
    });
    
    
    this.redis.on('error', (err) => {
      logger.error('Redis Error:', err);
    });
    
    this.redis.on('connect', () => {
      logger.info('Redis connected successfully');
    });
    
    this.redis.on('ready', () => {
      logger.info('Redis ready for operations');
    });
    
    this.redis.on('reconnecting', () => {
      logger.warn('Redis reconnecting...');
    });
    
 
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      await this.cleanup();
      process.exit(0);
    });
  }

  private async cleanup() {
    logger.info('Cleaning up database connections...');
    await this.prisma.$disconnect();
    await this.redis.quit();
  }
  
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }
  
  public async checkConnections(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      // Lazily connect Redis if not connected yet
      if (!this.redis.status || this.redis.status === 'end') {
        await this.redis.connect();
      }
      await this.redis.ping();
      return true;
    } catch (error) {
      logger.error('Connection check failed:', error);
      return false;
    }
  }
  
  public getPrisma(): PrismaClient {
    return this.prisma;
  }
  
  public getRedis(): Redis {
    return this.redis;
  }
}

const dbService = DatabaseService.getInstance();
export const prisma = dbService.getPrisma();
export const redis = dbService.getRedis();
export default dbService;