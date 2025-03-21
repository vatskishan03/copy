import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { generateToken } from '../utils/tokenGenerator';
import { logger } from '../config/logger';

export class SnippetService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async createSnippet(content: string): Promise<{ token: string }> {
    try {
      const token = await generateToken(5);
      
      const snippet = await this.prisma.snippet.create({
        data: {
          token,
          content,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
        }
      });

      await this.redis.setex(
        `snippet:${token}`,
        24 * 60 * 60,
        JSON.stringify(snippet)
      );

      logger.info(`Snippet created with token: ${token}`);
      return { token };
    } catch (error) {
      logger.error('Error creating snippet:', error);
      throw error;
    }
  }

  async getSnippet(token: string) {
    try {
      const cached = await this.redis.get(`snippet:${token}`);
      if (cached) {
        const snippet = JSON.parse(cached);
        await this.updateLastAccessed(token);
        return snippet;
      }

      const snippet = await this.prisma.snippet.findUnique({
        where: { token }
      });

      if (snippet) {
        await this.updateLastAccessed(token);
        await this.redis.setex(
          `snippet:${token}`,
          24 * 60 * 60,
          JSON.stringify(snippet)
        );
      }

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
        data: { 
          content,
          lastAccessed: new Date()
        }
      });

      await this.redis.setex(
        `snippet:${token}`, 
        24 * 60 * 60,
        JSON.stringify(updated)
      );

      return updated;
    } catch (error) {
      logger.error('Error updating snippet:', error);
      throw error;
    }
  }

  private async updateLastAccessed(token: string) {
    await this.prisma.snippet.update({
      where: { token },
      data: { lastAccessed: new Date() }
    });
  }
}