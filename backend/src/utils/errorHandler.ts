// backend/src/utils/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err); // Log the error for debugging

  let statusCode = 500; // Internal Server Error by default
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400; // Bad Request for validation errors
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  } else if (err.name === 'MongoServerError' && err.code === 11000) {
    statusCode = 409; // Conflict for duplicate key errors
    message = 'Duplicate value for a unique field';
  }

  res.status(statusCode).json({ message }); // Send error response to the client
}

export default errorHandler;
