import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import redisClient from '../config/redis';

// Standard rate limiter
export const standardLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

// API rate limiter (stricter)
export const apiLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 30, // 30 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many API requests, please try again later.' }
});

// Authentication attempts limiter (very strict)
export const authLimiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.call(...args),
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 failed attempts per hour
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts
  message: { error: 'Too many login attempts, please try again later.' }
});