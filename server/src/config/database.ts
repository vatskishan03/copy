import { PrismaClient } from '@prisma/client'
import { Redis } from 'ioredis'
import { logger } from './logger'

// Prisma client singleton
const prisma = new PrismaClient({
  log: [
    { level: 'warn', emit: 'event' },
    { level: 'error', emit: 'event' }
  ],
})

// Redis client singleton
const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  }
})

// Error handling with proper logging
prisma.$on('error', (e) => {
  logger.error('Prisma Error:', e)
})

prisma.$on('warn', (e) => {
  logger.warn('Prisma Warning:', e)
})

redis.on('error', (err) => {
  logger.error('Redis Error:', err)
})

redis.on('connect', () => {
  logger.info('Redis connected successfully')
})

process.on('SIGINT', async () => {
  await prisma.$disconnect()
  await redis.quit()
  process.exit(0)
})

export { prisma, redis }