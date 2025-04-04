
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../middleware/errorHandler';
import { User, UserRole } from '../models/types';
import { users, addUser, findUserByEmail } from '../models/mockData';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h';

export const register = async (req: Request, res: Response, next: NextFunction) => {

  console.log('✅ Register controller loaded'); 
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      const error: ApiError = new Error('All fields are required');
      error.statusCode = 400;
      throw error;
    }

    // Check if user already exists
    if (findUserByEmail(email)) {
      const error: ApiError = new Error('User with this email already exists');
      error.statusCode = 409;
      throw error;
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const newUser = addUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: UserRole.USER,
      isApproved: false,
      isActive: true,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      status: 'success',
      message: 'User registered successfully, waiting for admin approval',
      data: userWithoutPassword
    });

  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    console.log(email,password);

    // Validate input
    if (!email || !password) {
      const error: ApiError = new Error('Email and password are required');
      error.statusCode = 400;
      throw error;
    }

    // Find user
    const user = findUserByEmail(email);
    if (!user) {
      const error: ApiError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Check if user is approved
    if (!user.isApproved) {
      const error: ApiError = new Error('Account pending approval');
      error.statusCode = 403;
      throw error;
    }

    // Check if user is active
    if (!user.isActive) {
      const error: ApiError = new Error('Account is deactivated');
      error.statusCode = 403;
      throw error;
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const error: ApiError = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      data: {
        user: userWithoutPassword,
        token
      }
    });

  } catch (err) {
    next(err);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // User is attached to request in auth middleware
    const user = users.find(u => u.id === (req as any).user.id);
    
    if (!user) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      status: 'success',
      data: userWithoutPassword
    });

  } catch (err) {
    next(err);
  }
};
