import { Server, Socket } from 'socket.io';
import { SnippetService } from './snippetService';

export class WebSocketService {
  private rooms: Map<string, Set<Socket>> = new Map();

  constructor(
    private io: Server,
    private snippetService: SnippetService
  ) {
    this.setupSocketHandlers();
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket: Socket) => {
      console.log('Client connected:', socket.id);

      socket.on('join-room', (token: string) => {
        this.joinRoom(socket, token);
      });

      socket.on('content-update', async ({ token, content }) => {
        await this.handleContentUpdate(token, content);
      });

      socket.on('disconnect', () => {
        this.handleDisconnect(socket);
      });
    });
  }

  private joinRoom(socket: Socket, token: string) {
    // Remove from previous rooms
    this.rooms.forEach(sockets => {
      sockets.delete(socket);
    });

    // Join new room
    socket.join(token);
    
    if (!this.rooms.has(token)) {
      this.rooms.set(token, new Set());
    }
    this.rooms.get(token)?.add(socket);

    // Notify room members
    this.io.to(token).emit('user-joined', {
      userId: socket.id,
      count: this.rooms.get(token)?.size || 0
    });
  }

  private async handleContentUpdate(token: string, content: string) {
    try {
      await this.snippetService.updateSnippet(token, content);
      this.io.to(token).emit('content-updated', { token, content });
    } catch (error) {
      console.error('Error updating content:', error);
    }
  }

  private handleDisconnect(socket: Socket) {
    this.rooms.forEach((sockets, token) => {
      if (sockets.has(socket)) {
        sockets.delete(socket);
        this.io.to(token).emit('user-left', {
          userId: socket.id,
          count: sockets.size
        });
      }
    });
  }
}