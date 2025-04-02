import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { generateToken } from '../utils/tokenGenerator';
import { logger } from '../config/logger';
import { CONFIG } from '../../shared/constants';


const SNIPPET_TTL = CONFIG.SNIPPET_EXPIRY;

export class SnippetService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async createSnippet(content: string): Promise<{ token: string }> {
    try {
      
      const token = await generateToken(5);
      
      // Get expiry date for both database and cache
      const expiryDate = new Date(Date.now() + SNIPPET_TTL * 1000);
      
      // Use a transaction to ensure data consistency
      const snippet = await this.prisma.$transaction(async (tx) => {
        return tx.snippet.create({
          data: {
            token,
            content,
            expiresAt: expiryDate
          }
        });
      });

      // Use pipeline for Redis operations
      const pipeline = this.redis.pipeline();
      pipeline.setex(`snippet:${token}`, SNIPPET_TTL, JSON.stringify(snippet));

      // Pre-initialize view count to avoid race conditions
      pipeline.set(`views:${token}`, 0);
      await pipeline.exec();

      logger.info(`Snippet created with token: ${token}`);
      return { token };
    } catch (error) {
      logger.error('Error creating snippet:', error);
      throw error;
    }
  }

  async getSnippet(token: string) {
    try {
      // Use pipeline to reduce Redis roundtrips
      const pipeline = this.redis.pipeline();
      pipeline.get(`snippet:${token}`);
      pipeline.incr(`views:${token}`);
      pipeline.expire(`views:${token}`, SNIPPET_TTL);
      
      const results = await pipeline.exec();
      const cachedData = results[0][1];
      const viewCount = parseInt(results[1][1] as string) || 0;
      
      if (cachedData) {
        const snippet = JSON.parse(cachedData as string);
        
        // Update database in background without blocking response
        this.updateSnippetStats(token, viewCount).catch(err => 
          logger.error('Background stats update failed:', err)
        );
        
        return snippet;
      }
      
      // Cache miss - get from database with optimistic locking
      const snippet = await this.prisma.$transaction(async (tx) => {
        // Check if snippet exists
        const existingSnippet = await tx.snippet.findUnique({
          where: { token }
        });
        
        if (!existingSnippet) return null;
        
        return tx.snippet.update({
          where: { token },
          data: { 
            lastAccessed: new Date(),
            viewCount: viewCount > 0 ? viewCount : { increment: 1 }
          }
        });
      });
      
      if (snippet) {
        // Cache the result with pipeline
        const cachePipeline = this.redis.pipeline();
        cachePipeline.setex(`snippet:${token}`, SNIPPET_TTL, JSON.stringify(snippet));
        
        // If we didn't have a view count in Redis, set it to match DB
        if (viewCount === 0) {
          cachePipeline.set(`views:${token}`, snippet.viewCount);
          cachePipeline.expire(`views:${token}`, SNIPPET_TTL);
        }
        cachePipeline.exec().catch(err => 
          logger.error('Cache repopulation failed:', err)
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
      // Use transaction for atomic update
      const updated = await this.prisma.$transaction(async (tx) => {
        // Get current view count to preserve it
        const current = await tx.snippet.findUnique({
          where: { token },
          select: { viewCount: true }
        });
        
        if (!current) throw new Error(`Snippet with token ${token} not found`);
        
        return tx.snippet.update({
          where: { token },
          data: { 
            content,
            lastAccessed: new Date()
          }
        });
      });

      // Update Redis cache with pipeline
      const pipeline = this.redis.pipeline();
      pipeline.setex(`snippet:${token}`, SNIPPET_TTL, JSON.stringify(updated));
      pipeline.expire(`views:${token}`, SNIPPET_TTL); // Reset view counter TTL
      await pipeline.exec();

      return updated;
    } catch (error) {
      logger.error('Error updating snippet:', error);
      throw error;
    }
  }

  // Background method to sync Redis view counts with database
  private async updateSnippetStats(token: string, viewCount: number) {
    try {
      await this.prisma.snippet.update({
        where: { token },
        data: { 
          lastAccessed: new Date(),
          viewCount: viewCount
        }
      });
    } catch (error) {
      logger.error(`Failed to update stats for token ${token}:`, error);
      // Non-critical operation, so we just log the error
    }
  }
}