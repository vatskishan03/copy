import express from 'express';
import http from 'http';
import cors from 'cors';
import snippetRoutes from './routes/snippetRoutes';
import { initializeWebSocket } from './services/websocketService';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/snippets', snippetRoutes);

// Initialize WebSocket
const io = initializeWebSocket(server);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app, server, io };