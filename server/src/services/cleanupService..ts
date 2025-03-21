import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { logger } from '../config/logger';

export class CleanupService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async cleanupExpiredSnippets() {
    try {
      const expired = await this.prisma.snippet.findMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      for (const snippet of expired) {
        await this.redis.del(`snippet:${snippet.token}`);
      }

      await this.prisma.snippet.deleteMany({
        where: {
          expiresAt: {
            lt: new Date()
          }
        }
      });

      logger.info(`Cleaned up ${expired.length} expired snippets`);
    } catch (error) {
      logger.error('Error cleaning up expired snippets:', error);
    }
  }
}