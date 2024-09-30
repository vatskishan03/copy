import Redis from 'ioredis';
import { logger } from '../utils/logger';

const createRedisClient = () => {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
  });

  redisClient.on('error', (error) => {
    logger.error('Redis Client Error', error);
  });

  redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
  });

  redisClient.on('ready', () => {
    logger.info('Redis Client Ready');
  });

  redisClient.on('reconnecting', () => {
    logger.info('Redis Client Reconnecting');
  });

  return redisClient;
};

const redisClient = createRedisClient();

export default redisClient;