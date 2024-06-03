import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import env from './config/env';
import connectDB from './config/db';
import snippetRoutes from './routes/snippet';
import snippetController from './controllers/snippet';
import { Server } from 'socket.io';
import http from 'http';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('io', io); // Make Socket.IO accessible in routes

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/snippet', snippetRoutes);

// Socket.IO Connection Handling (in the main app.ts file)
io.of('/snippet').on('connection', (socket) => {
  console.log('A user connected to the snippet namespace');

  socket.on('joinSnippet', (snippetId: string) => {
    socket.join(snippetId);
  });

  socket.on('updateSnippet', (snippetId: string, changes: any) => {
    snippetController.updateSnippet(socket, snippetId, changes);
  });

  socket.on('undoSnippet', (snippetId: string) => {
    snippetController.undoSnippet(socket, snippetId);
  });
});

// Error Handling Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); 

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ message });
});

// Start Server
const port = env.PORT;
server.listen(port, async () => {
  await connectDB(); // Connect to MongoDB when the server starts
  console.log(`Server running on port ${port}`);
});
