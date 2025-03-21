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

      // Handle real-time content updates with debouncing
      socket.on('content-change', async ({ token, content, cursor }) => {
        try {
          // Store content in buffer
          this.contentBuffers.set(token, content);

          // Clear existing timeout
          const existingTimeout = this.updateTimeouts.get(token);
          if (existingTimeout) {
            clearTimeout(existingTimeout);
          }

          // Set new timeout for debounced update
          const timeout = setTimeout(async () => {
            const bufferedContent = this.contentBuffers.get(token);
            if (bufferedContent !== undefined) {
              await this.handleContentUpdate(token, bufferedContent);
              this.contentBuffers.delete(token);
            }
          }, 1000); // 1 second debounce

          this.updateTimeouts.set(token, timeout);

          // Broadcast cursor position immediately
          socket.broadcast.to(token).emit('cursor-update', {
            userId: socket.id,
            cursor
          });
        } catch (error) {
          logger.error('Error in content-change:', error);
          socket.emit('error', { message: 'Failed to sync changes' });
        }
      });

      // Handle cursor position updates
      socket.on('cursor-move', ({ token, position }) => {
        socket.broadcast.to(token).emit('cursor-update', {
          userId: socket.id,
          position
        });
      });

      // Handle selection updates
      socket.on('selection-change', ({ token, selection }) => {
        socket.broadcast.to(token).emit('selection-update', {
          userId: socket.id,
          selection
        });
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
        logger.info(`Client disconnected: ${socket.id}`);
      });
    });
  }

  private joinRoom(socket: Socket, token: string) {
    // Leave previous rooms
    this.rooms.forEach(sockets => {
      sockets.delete(socket);
    });

    // Join new room
    socket.join(token);
    
    if (!this.rooms.has(token)) {
      this.rooms.set(token, new Set());
    }
    this.rooms.get(token)?.add(socket);

    const roomSize = this.rooms.get(token)?.size || 0;
    
    // Notify all room members including the new one
    this.io.to(token).emit('user-joined', {
      userId: socket.id,
      count: roomSize
    });

    logger.info(`User ${socket.id} joined room ${token}. Total users: ${roomSize}`);
  }

  private async handleContentUpdate(token: string, content: string) {
    try {
      // Update in database
      await this.snippetService.updateSnippet(token, content);
      
      // Broadcast to all clients in room except sender
      this.io.to(token).emit('content-updated', { content });
      
      logger.debug(`Content updated in room ${token}`);
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

        logger.info(`User ${socket.id} left room ${token}. Total users: ${roomSize}`);
        
        // Clean up empty rooms
        if (roomSize === 0) {
          this.cleanupRoom(token);
          logger.info(`Room ${token} removed as it's empty`);
        }
      }
    });
  }

  private cleanupRoom(token: string) {
    // Clear any pending timeouts
    const timeout = this.updateTimeouts.get(token);
    if (timeout) {
      clearTimeout(timeout);
      this.updateTimeouts.delete(token);
    }

    // Clear content buffer
    this.contentBuffers.delete(token);

    // Remove room
    this.rooms.delete(token);
  }
}