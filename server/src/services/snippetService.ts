import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';
import { generateToken } from '../utils/tokenGenerator';

export class SnippetService {
  constructor(
    private prisma: PrismaClient,
    private redis: Redis
  ) {}

  async createSnippet(content: string): Promise<{ token: string }> {
    const token = generateToken();
    
    // First try to get from cache
    const cachedToken = await this.redis.get(`snippet:${token}`);
    if (cachedToken) {
      return this.createSnippet(content); // Regenerate if token exists
    }

    // Create in DB
    const snippet = await this.prisma.snippet.create({
      data: {
        token,
        content,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    });

    // Cache the new snippet
    await this.redis.setex(
      `snippet:${token}`,
      24 * 60 * 60, // 24 hours
      JSON.stringify(snippet)
    );

    return { token };
  }

  async getSnippet(token: string) {
    // Try cache first
    const cached = await this.redis.get(`snippet:${token}`);
    if (cached) {
      return JSON.parse(cached);
    }

    // Fallback to DB
    const snippet = await this.prisma.snippet.findUnique({
      where: { token }
    });

    if (snippet) {
      // Cache for subsequent requests
      await this.redis.setex(
        `snippet:${token}`,
        24 * 60 * 60,
        JSON.stringify(snippet)
      );
    }

    return snippet;
  }

  async updateSnippet(token: string, content: string) {
    // Update DB
    const updated = await this.prisma.snippet.update({
      where: { token },
      data: { content }
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