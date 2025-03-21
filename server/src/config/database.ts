import { Prisma, PrismaClient } from '@prisma/client';
import { Redis, RedisOptions } from 'ioredis';
import { logger } from './logger';
import { TLSSocket } from 'tls';

class DatabaseService {
  private static instance: DatabaseService;
  private prisma: PrismaClient;
  private redis: Redis;

  private constructor() {
    this.prisma = new PrismaClient({
      log: [
        { level: 'warn', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'info', emit: 'event' },
        { level: 'query', emit: 'event' },
      ],
    });

    const redisConfig: RedisOptions = {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT || '18613'),
      username: 'default',
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Failed to connect to Redis after 3 retries');
          return null;
        }
        return Math.min(times * 50, 2000);
      },
      enableOfflineQueue: true,
      family: 4
    };

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