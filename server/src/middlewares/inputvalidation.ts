import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSnippetCreation = [
  body('content').trim().notEmpty().withMessage('Content cannot be empty')
    .isLength({ max: 10000 }).withMessage('Content must be less than 10000 characters'),
];

export const validateSnippetRetrieval = [
  param('token').trim().isLength({ min: 5, max: 5 }).withMessage('Invalid token format'),
];

export const validateSnippetUpdate = [
  param('token').trim().isLength({ min: 5, max: 5 }).withMessage('Invalid token format'),
  body('content').trim().notEmpty().withMessage('Content cannot be empty')
    .isLength({ max: 10000 }).withMessage('Content must be less than 10000 characters'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};