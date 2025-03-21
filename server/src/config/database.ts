import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'
import { logger } from './logger'

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
      ],
    });

    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      enableReadyCheck: true,
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    
    this.prisma.$on('error', (e) => {
      logger.error('Prisma Error:', e);
    });

    this.prisma.$on('warn', (e) => {
      logger.warn('Prisma Warning:', e);
    });

    this.prisma.$on('info', (e) => {
      logger.info('Prisma Info:', e);
    });

    // Redis event handlers
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

    // Cleanup on application shutdown
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
      // Check Prisma connection
      await this.prisma.$queryRaw`SELECT 1`;
      
      // Check Redis connection
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