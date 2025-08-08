import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { SnippetService } from './services/snippetService';
import { WebSocketService } from './services/websocketService';
import dbService, { prisma, redis } from './config/database';
import snippetRoutes from './routes/snippetRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { validateEnv } from './env';
import { logger } from './config/logger';
import compression from 'compression';
import { CleanupService } from './services/cleanupService';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

const env = validateEnv();

const app = express();
const server = http.createServer(app);


app.set('trust proxy', 1);

// Initialize services
const snippetService = new SnippetService(prisma, redis);
const cleanupService = new CleanupService(prisma, redis);

const normalize = (u: string) => (u ? u.replace(/\/$/, '') : u);
const allowedOrigins = [
  normalize(env.CLIENT_URL),
  'https://copyit.in',
  'http://localhost:3000'
];

// Lightweight liveness endpoint placed before heavier middlewares
app.get('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({ status: 'ok', ts: new Date().toISOString() });
});
app.head('/health', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).end();
});

app.use(
  cors({
    origin: function (origin, callback) {
      const isAllowed =
        !origin ||
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(origin || '') ||
        /\.onrender\.com$/.test(origin || '');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      const originNoSlash = origin.replace(/\/$/, '');
      const isAllowed =
        allowedOrigins.includes(originNoSlash) ||
        /\.vercel\.app$/.test(originNoSlash) ||
        /\.onrender\.com$/.test(originNoSlash);
      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error(`Origin ${origin} not allowed by WebSocket CORS`));
      }
    },
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const webSocketService = new WebSocketService(io, snippetService);



app.use(express.json());
app.use(compression({ threshold: 1024 }));
app.use(helmet());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});


app.use('/api/', apiLimiter);

const tokenLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 tokens per hour per IP
});
app.use('/api/snippets/token', tokenLimiter);

// Readiness endpoint that checks critical dependencies with a short timeout
app.get('/readyz', async (_req, res) => {
  res.set('Cache-Control', 'no-store');

  const withTimeout = <T>(p: Promise<T>, ms: number): Promise<T> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), ms);
      p.then((v) => { clearTimeout(t); resolve(v); })
        .catch((e) => { clearTimeout(t); reject(e); });
    });

  const pgCheck = withTimeout(prisma.$queryRaw`SELECT 1`, 2500)
    .then(() => true)
    .catch(() => false);

  const redisCheck = withTimeout(
    (async () => {
      if (!redis.status || redis.status === 'end') {
        try { await (redis as any).connect?.(); } catch { /* ignore */ }
      }
      await redis.ping();
      return true;
    })(),
    2000
  ).then(() => true).catch(() => false);

  try {
    const [pgOk, redisOk] = await Promise.all([pgCheck, redisCheck]);

    // Consider service ready if Postgres is OK (core dependency).
    // Redis enhances performance but the app can operate without it.
    const ready = pgOk;
    const status = ready ? 'ready' : 'unavailable';
    const httpCode = ready ? 200 : 503;

    return res.status(httpCode).json({
      status,
      components: {
        postgres: pgOk ? 'ok' : 'down',
        redis: redisOk ? 'ok' : 'down',
      },
    });
  } catch {
    return res.status(503).json({ status: 'unavailable' });
  }
});

app.use('/api/snippets', snippetRoutes);
app.use(notFoundHandler);
app.use(errorHandler);


// Tune Node HTTP server timeouts to play nicely with proxies
server.keepAliveTimeout = 65000; // slightly higher than typical proxy idle timeout
server.headersTimeout = 66000;
server.requestTimeout = 30000;

const PORT = env.PORT;
server.listen(PORT, () => {
  logger.info(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  logger.info(`WebSocket server ready for connections`);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  try {
    await prisma.$disconnect();
    await redis.quit();
    logger.info('Database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Catch unhandled promise rejections and exceptions to avoid hard crashes
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason as any);
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
});

export { app, server, io };