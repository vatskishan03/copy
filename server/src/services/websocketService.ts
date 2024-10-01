import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { getSnippet, updateSnippet } from './snippetService';
import { logger } from '../utils/logger';

export const initializeWebSocket = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    logger.info(`New WebSocket connection: ${socket.id}`);

    socket.on('join-snippet', async (token: string) => {
      try {
        const snippet = await getSnippet(token);
        socket.join(token);
        socket.emit('snippet-data', snippet.content);
      } catch (error) {
        socket.emit('error', 'Failed to join snippet room');
      }
    });

    socket.on('update-snippet', async ({ token, content }: { token: string; content: string }) => {
      try {
        await updateSnippet(token, content);
        socket.to(token).emit('snippet-updated', content);
      } catch (error) {
        socket.emit('error', 'Failed to update snippet');
      }
    });

    socket.on('disconnect', () => {
      logger.info(`WebSocket disconnected: ${socket.id}`);
    });
  });

  return io;
};