import { body, param, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateSnippetCreation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content cannot be empty')
    .isLength({ max: 10000 }).withMessage('Content must be less than 10000 characters'),
];

export const validateSnippetRetrieval = [
  param('token')
    .trim()
    .isLength({ min: 5, max: 5 }).withMessage('Token must be exactly 5 characters')
    .matches(/^[A-Z0-9!@$&*()]+$/).withMessage('Token contains invalid characters'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};