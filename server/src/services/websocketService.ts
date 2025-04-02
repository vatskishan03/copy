import { Server, Socket } from 'socket.io';
import { SnippetService } from './snippetService';
import { logger } from '../config/logger';

export class WebSocketService {
  private rooms: Map<string, Set<Socket>> = new Map();
  private contentBuffers: Map<string, string> = new Map();
  private updateTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private io: Server,
    private snippetService: SnippetService
  ) {
    this.setupSocketHandlers();
    logger.info('WebSocket service initialized');
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Client connected: ${socket.id}`);

      socket.on('content-change', async ({ token, content, cursor }) => {
        try {
          this.contentBuffers.set(token, content);

          const existingTimeout = this.updateTimeouts.get(token);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          const timeout = setTimeout(async () => {
            const bufferedContent = this.contentBuffers.get(token);
            if (bufferedContent !== undefined) {
              await this.handleContentUpdate(token, bufferedContent);
              this.contentBuffers.delete(token);
            }
          }, 250); 

          this.updateTimeouts.set(token, timeout);

          socket.broadcast.to(token).emit('cursor-update', {
            userId: socket.id,
            cursor
          });
        } catch (error) {
          logger.error('Error in content-change:', error);
          socket.emit('error', { message: 'Failed to sync changes' });
        }
      });

      socket.on('join-room', async (token: string) => {
        try {
          const snippet = await this.snippetService.getSnippet(token);
          if (!snippet) {
            socket.emit('error', { message: 'Invalid token' });
            return;
          }

          this.joinRoom(socket, token);
          
          socket.emit('content-load', {
            content: snippet.content,
            collaborators: Array.from(this.rooms.get(token) || []).map(s => s.id)
          });
        } catch (error) {
          logger.error('Error joining room:', error);
          socket.emit('error', { message: 'Failed to join room' });
        }
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private joinRoom(socket: Socket, token: string) {
    this.rooms.forEach(sockets => sockets.delete(socket));
    socket.join(token);
    
    if (!this.rooms.has(token)) {
      this.rooms.set(token, new Set());
    }
    this.rooms.get(token)?.add(socket);

    const roomSize = this.rooms.get(token)?.size || 0;
    this.io.to(token).emit('user-joined', {
      userId: socket.id,
      count: roomSize
    });

    logger.info(`User ${socket.id} joined room ${token}. Total users: ${roomSize}`);
  }

  private async handleContentUpdate(token: string, content: string) {
    try {
      await this.snippetService.updateSnippet(token, content);
      this.io.to(token).emit('content-updated', { content });
    } catch (error) {
      logger.error('Error updating content:', error);
      throw error;
    }
  }

  private handleDisconnect(socket: Socket) {
    this.rooms.forEach((sockets, token) => {
      if (sockets.has(socket)) {
        sockets.delete(socket);
        const roomSize = sockets.size;
        
        this.io.to(token).emit('user-left', {
          userId: socket.id,
          count: roomSize
        });

        if (roomSize === 0) {
          this.cleanupRoom(token);
        }
      }
    });
    logger.info(`Client disconnected: ${socket.id}`);
  }

  private cleanupRoom(token: string) {
    const timeout = this.updateTimeouts.get(token);
    if (timeout) {
      clearTimeout(timeout);
      this.updateTimeouts.delete(token);
    }
    this.contentBuffers.delete(token);
    this.rooms.delete(token);
    logger.info(`Room ${token} cleaned up`);
  }
}