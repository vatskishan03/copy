import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { generateToken } from '../utils/tokenGenerator';

export class SnippetService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async createSnippet(content: string): Promise<{ token: string }> {
  
    const token = await generateToken(5);
    
    // Create snippet in DB
    const snippet = await this.prisma.snippet.create({
      data: {
        token,
        content,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Cache the snippet
    await this.redis.setex(
      `snippet:${token}`,
      24 * 60 * 60,
      JSON.stringify(snippet)
    );

    return { token };
  }

  async getSnippet(token: string) {
    // Try cache first
    const cached = await this.redis.get(`snippet:${token}`);
    if (cached) {
      // Update last accessed time
      const snippet = JSON.parse(cached);
      await this.prisma.snippet.update({
        where: { token },
        data: { lastAccessed: new Date() }
      });
      return snippet;
    }

    // Fallback to DB
    const snippet = await this.prisma.snippet.findUnique({
      where: { token }
    });

    if (snippet) {
      // Update last accessed time and cache
      await this.prisma.snippet.update({
        where: { token },
        data: { lastAccessed: new Date() }
      });
      
      await this.redis.setex(
        `snippet:${token}`,
        24 * 60 * 60,
        JSON.stringify(snippet)
      );
    }

    return snippet;
  }

  async updateSnippet(token: string, content: string) {
    // Update in DB
    const updated = await this.prisma.snippet.update({
      where: { token },
      data: { 
        content,
        lastAccessed: new Date()
      }
    });

    // Update cache
    await this.redis.setex(
      `snippet:${token}`, 
      24 * 60 * 60,
      JSON.stringify(updated)
    );

    return updated;
  }
}