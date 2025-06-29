import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { SnippetService } from './services/snippetService'; 
import { WebSocketService } from './services/websocketService';
import { prisma, redis } from './config/database';
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

// Initialize services
const snippetService = new SnippetService(prisma, redis);
const cleanupService = new CleanupService(prisma, redis);

const allowedOrigins = [
  "https://copyit.in",  
  "http://localhost:3000"
];

app.use(cors({
  origin: function (origin, callback) {
   
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
}));

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
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

// setInterval(() => {
//   cleanupService.cleanupExpiredSnippets();
// }, 60 * 60 * 5000);


app.use(express.json());
app.use(compression());
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

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Backend is running', 
    timestamp: new Date().toISOString() 
  });
});

app.use('/api/snippets', snippetRoutes);
app.use(notFoundHandler);


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

export { app, server, io };