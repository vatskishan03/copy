// backend/src/routes/snippet.ts
import express from 'express';
import snippetController from '../controllers/snippet'; 
import { Server, Socket } from 'socket.io'; // Import Socket.IO types

const router = express.Router();
const wrap = (fn: any) => (...args: any) => fn(...args).catch(args[2]); // Error handling middleware

// Make io accessible to routes (assuming you have app.set('io', io) in your app.ts)
router.use((req: any, res, next) => {
  req.io = req.app.get('io'); // Get Socket.IO instance from the app object
  next(); 
});

// POST /api/snippet/create - Create a new snippet
router.post('/create', wrap((req: any, res: any) => snippetController.createSnippet(req, res, req.io))); // Pass req.io

// GET /api/snippet/:token - Get a snippet by its token
router.get('/:token', wrap((req: any, res: any) => snippetController.getSnippet(req, res, req.io))); // Pass req.io

export default router;
