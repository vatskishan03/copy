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
      // First check if the snippet exists
      const cached = await this.redis.get(`snippet:${token}`);
      
      // If it exists, increment the view count first
      if (cached) {
        // Update access time and increment count in the database
        await this.updateLastAccessed(token);
        
        // Re-fetch the updated snippet with incremented view count
        const updatedSnippet = await this.prisma.snippet.findUnique({
          where: { token }
        });
        
        if (updatedSnippet) {
          // Update the cache with fresh data that includes the incremented view count
          await this.redis.setex(
            `snippet:${token}`,
            24 * 60 * 60,
            JSON.stringify(updatedSnippet)
          );
          return updatedSnippet;
        }
        
        // Fallback to using cached data if refetch fails for some reason
        return JSON.parse(cached);
      }
  
      // If not in cache, get from database
      const snippet = await this.prisma.snippet.findUnique({
        where: { token }
      });
  
      if (snippet) {
        // Update access time and increment count
        await this.updateLastAccessed(token);
        
        // Get the updated snippet with the new view count
        const updatedSnippet = await this.prisma.snippet.findUnique({
          where: { token }
        });
        
        // Cache the updated version with correct view count
        if (updatedSnippet) {
          await this.redis.setex(
            `snippet:${token}`,
            24 * 60 * 60,
            JSON.stringify(updatedSnippet)
          );
          return updatedSnippet;
        }
        
        return snippet;
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
      data: { 
        lastAccessed: new Date(),
        viewCount: { increment: 1 } 
      }
    });
  }
}