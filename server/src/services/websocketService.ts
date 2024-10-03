import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { decrypt, encrypt } from '../utils/encryption';

export class WebSocketService {
  private io: SocketIOServer;
  private rooms: Map<string, Y.Doc> = new Map();

  constructor(server: HttpServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', this.handleConnection.bind(this));
  }

  private handleConnection(socket: Socket) {
    console.log('New client connected');

    socket.on('join-room', (roomId: string) => this.handleJoinRoom(socket, roomId));
    socket.on('leave-room', (roomId: string) => this.handleLeaveRoom(socket, roomId));
    socket.on('disconnect', () => this.handleDisconnect(socket));
  }

  private handleJoinRoom(socket: Socket, roomId: string) {
    socket.join(roomId);
    console.log(`Client joined room: ${roomId}`);

    if (!this.rooms.has(roomId)) {
      const doc = new Y.Doc();
      this.rooms.set(roomId, doc);

      new WebsocketProvider(`ws://localhost:${process.env.PORT}`, roomId, doc);
    }

    const doc = this.rooms.get(roomId)!;
    const encryptedContent = doc.getText('content').toString();
    const decryptedContent = decrypt(encryptedContent);

    socket.emit('initial-content', decryptedContent);
  }

  private handleLeaveRoom(socket: Socket, roomId: string) {
    socket.leave(roomId);
    console.log(`Client left room: ${roomId}`);
  }

  private handleDisconnect(socket: Socket) {
    console.log('Client disconnected');
  }

  public async updateContent(roomId: string, content: string) {
    const doc = this.rooms.get(roomId);
    if (doc) {
      const encryptedContent = encrypt(content);
      doc.getText('content').delete(0, doc.getText('content').length);
      doc.getText('content').insert(0, encryptedContent);
    }
  }
public async notifySnippetDeleted(snippetId: string) {
  this.io.to(snippetId).emit('snippet-deleted', snippetId);
  this.rooms.delete(snippetId);
}
}
