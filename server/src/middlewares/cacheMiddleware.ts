import { Request, Response, NextFunction } from 'express';
import { redis } from '../config/database';
import { logger } from '../config/logger';

export const cacheMiddleware = (ttlSeconds = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') return next();
    
    const cacheKey = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return res.json(JSON.parse(cachedData));
      }
      
      
      const originalJson = res.json;
      
      res.json = function(body) {
        redis.setex(cacheKey, ttlSeconds, JSON.stringify(body));
        logger.debug(`Cache set for ${cacheKey}`);
        return originalJson.call(this, body);
      };
      
      next();
    } catch (error) {
      logger.error('Cache middleware error:', error);
      next();
    }
  };
};