// server/src/middlewares/cacheMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import redisClient from '../config/redis.ts';

export const cacheMiddleware = (ttlSeconds = 300) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip cache for non-GET requests
    if (req.method !== 'GET') return next();
    
    const cacheKey = `cache:${req.originalUrl}`;
    
    try {
      const cachedData = await redisClient.get(cacheKey);
      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }
      
      // Store original res.json method
      const originalSend = res.json;
      
      // Override res.json method
      res.json = function(body) {
        redisClient.setex(cacheKey, ttlSeconds, JSON.stringify(body));
        return originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      console.error('Cache error:', error);
      next();
    }
  };
};