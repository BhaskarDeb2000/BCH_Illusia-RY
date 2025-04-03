
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from './errorHandler';

// JWT secret should be in environment variables in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Extended Request interface to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      const error: ApiError = new Error('Authentication required');
      error.statusCode = 401;
      throw error;
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    const apiError: ApiError = new Error('Invalid or expired token');
    apiError.statusCode = 401;
    next(apiError);
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    const error: ApiError = new Error('Admin privileges required');
    error.statusCode = 403;
    return next(error);
  }
  next();
};

export const isSuperAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'superAdmin') {
    const error: ApiError = new Error('Super admin privileges required');
    error.statusCode = 403;
    return next(error);
  }
  next();
};
