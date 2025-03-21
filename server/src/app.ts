import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { SnippetService } from './services/snippetService';
import { WebSocketService } from './services/websocketService';
import { prisma, redis } from './config/database';
import snippetRoutes from './routes/snippetRoutes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler';

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Initialize services
const snippetService = new SnippetService(prisma, redis);
const webSocketService = new WebSocketService(io, snippetService);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/snippets', snippetRoutes);

const PORT = process.env.PORT || 3001;

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, io };