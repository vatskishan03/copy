import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { generateToken } from '../utils/tokenGenerator';
import { logger } from '../config/logger';
import { CONFIG } from '../shared/constants';


const SNIPPET_TTL = CONFIG.SNIPPET_EXPIRY;

export class SnippetService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async createSnippet(content: string): Promise<{ token: string }> {
    try {
      const expiryDate = new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);

      // Insert-first with retry on unique constraint (P2002)
      for (let attempt = 0; attempt < 5; attempt++) {
        const token = await generateToken();
        try {
          const snippet = await this.prisma.snippet.create({
            data: { token, content, expiresAt: expiryDate }
          });

          // Fire-and-forget cache writes to avoid blocking response
          const pipeline = this.redis.pipeline();
          pipeline.setex(`snippet:${token}`, 31536000, JSON.stringify(snippet));
          pipeline.set(`views:${token}`, 0);
          pipeline.exec().catch(err => logger.error('Create cache pipeline failed:', err));

          logger.info(`Snippet created with token: ${token}`);
          return { token };
        } catch (err: any) {
          // Prisma unique violation for token
          if (err?.code === 'P2002' || /unique/i.test(String(err?.message))) {
            continue; // retry with a new token
          }
          throw err;
        }
      }
      throw new Error('Failed to generate unique token after retries');
    } catch (error) {
      logger.error('Error creating snippet:', error);
      throw error;
    }
  }

  async getSnippet(token: string) {
    try {
      // Try Redis quickly; if slow or miss, fall through
      let cached: any | null = null;
      try {
        const getPromise = this.redis.get(`snippet:${token}`);
        const result = await Promise.race([
          getPromise,
          new Promise((_, rej) => setTimeout(() => rej(new Error('redis-timeout')), 100))
        ]);
        if (typeof result === 'string') {
          cached = JSON.parse(result);
        }
      } catch (_) {}

      if (cached) {
        // Non-blocking counter updates
        this.redis
          .pipeline()
          .incr(`views:${token}`)
          .expire(`views:${token}`, SNIPPET_TTL)
          .exec()
          .catch(() => {});

        this.updateSnippetStats(token).catch(err => logger.error('BG stats update failed:', err));
        return cached;
      }

      // DB read on cache miss (single query)
      const snippet = await this.prisma.snippet.findUnique({ where: { token } });
      if (!snippet) return null;

      // Respond quickly; repopulate cache and update stats in background
      this.redis
        .pipeline()
        .setex(`snippet:${token}`, 31536000, JSON.stringify(snippet))
        .exec()
        .catch(() => {});
      this.updateSnippetStats(token, { incrementView: true }).catch(() => {});

      return snippet;
    } catch (error) {
      logger.error('Error getting snippet:', error);
      throw error;
    }
  }

  async updateSnippet(token: string, content: string) {
    try {
      const updated = await this.prisma.snippet.update({
        where: { token },
        data: { content, lastAccessed: new Date() }
      });

      // Fire-and-forget cache refresh
      this.redis
        .pipeline()
        .setex(`snippet:${token}`, 31536000, JSON.stringify(updated))
        .expire(`views:${token}`, 31536000)
        .exec()
        .catch(() => {});

      return updated;
    } catch (error) {
      logger.error('Error updating snippet:', error);
      throw error;
    }
  }

  // Background method to sync Redis view counts with database
  private async updateSnippetStats(token: string, opts?: { incrementView?: boolean }) {
    try {
      await this.prisma.snippet.update({
        where: { token },
        data: {
          lastAccessed: new Date(),
          ...(opts?.incrementView ? { viewCount: { increment: 1 } } : {})
        }
      });
    } catch (error) {
      logger.error(`Failed to update stats for token ${token}:`, error);
      // Non-critical operation, so we just log the error
    }
  }
}