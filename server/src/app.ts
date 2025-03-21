import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { SnippetService } from './services/snippetService'; // Changed from snippetService to SnippetService
import { WebSocketService } from './services/websocketService';
import { prisma, redis } from './config/database';
import snippetRoutes from './routes/snippetRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';
import { validateEnv } from './env';
import { logger } from './config/logger';
import compression from 'compression';
import { CleanupService } from './services/cleanupService';

const env = validateEnv();

const app = express();
const server = http.createServer(app);

// Initialize services
const snippetService = new SnippetService(prisma, redis);
const cleanupService = new CleanupService(prisma, redis);
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST']
  },
  pingTimeout: 60000,
  pingInterval: 25000
});

const webSocketService = new WebSocketService(io, snippetService);

// Setup cleanup interval
setInterval(() => {
  cleanupService.cleanupExpiredSnippets();
}, 60 * 60 * 5000);

// Middleware
app.use(cors({
  origin: env.CLIENT_URL,
  optionsSuccessStatus: 200
}));
app.use(express.json());
app.use(compression());

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/snippets', snippetRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
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