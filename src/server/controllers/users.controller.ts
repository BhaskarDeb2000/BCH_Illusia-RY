
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import bcrypt from 'bcrypt';
import { ApiError } from '../middleware/errorHandler';
import { User, UserRole } from '../models/types';
import { users, findUserById } from '../models/mockData';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Filter out passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    // Filter by approval status if requested
    const { pending } = req.query;
    let filteredUsers = usersWithoutPasswords;
    
    if (pending === 'true') {
      filteredUsers = filteredUsers.filter(user => !user.isApproved);
    }
    
    res.status(200).json({
      status: 'success',
      results: filteredUsers.length,
      data: filteredUsers
    });
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = findUserById(id);
    
    if (!user) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json({
      status: 'success',
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      isApproved: true,
      updatedAt: new Date()
    };
    
    // Remove password from response
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.status(200).json({
      status: 'success',
      message: 'User approved successfully',
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const toggleUserActive = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    
    if (isActive === undefined) {
      const error: ApiError = new Error('isActive field is required');
      error.statusCode = 400;
      throw error;
    }
    
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Prevent deactivating super admin (Vera)
    if (users[userIndex].role === UserRole.SUPER_ADMIN && !isActive) {
      const error: ApiError = new Error('Cannot deactivate super admin account');
      error.statusCode = 403;
      throw error;
    }
    
    // Check if attempting to change another admin (only super admin can do this)
    if (
      users[userIndex].role === UserRole.ADMIN && 
      (req as AuthRequest).user?.role !== UserRole.SUPER_ADMIN
    ) {
      const error: ApiError = new Error('Only super admin can modify admin accounts');
      error.statusCode = 403;
      throw error;
    }
    
    // Update user
    users[userIndex] = {
      ...users[userIndex],
      isActive,
      updatedAt: new Date()
    };
    
    // Remove password from response
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.status(200).json({
      status: 'success',
      message: isActive ? 'User activated successfully' : 'User deactivated successfully',
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate input
    if (!role || !Object.values(UserRole).includes(role)) {
      const error: ApiError = new Error('Valid role is required');
      error.statusCode = 400;
      throw error;
    }
    
    // Only super admin can update roles
    if (req.user?.role !== UserRole.SUPER_ADMIN) {
      const error: ApiError = new Error('Only super admin can update user roles');
      error.statusCode = 403;
      throw error;
    }
    
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Prevent changing super admin role
    if (users[userIndex].role === UserRole.SUPER_ADMIN) {
      const error: ApiError = new Error('Cannot change super admin role');
      error.statusCode = 403;
      throw error;
    }
    
    // Update user role
    users[userIndex] = {
      ...users[userIndex],
      role: role as UserRole,
      updatedAt: new Date()
    };
    
    // Remove password from response
    const { password, ...userWithoutPassword } = users[userIndex];
    
    res.status(200).json({
      status: 'success',
      message: 'User role updated successfully',
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};

export const updateUserProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user exists
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      const error: ApiError = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check authorization (user can only update their own profile, admins can update any)
    if (
      req.user?.id !== id && 
      req.user?.role !== UserRole.ADMIN && 
      req.user?.role !== UserRole.SUPER_ADMIN
    ) {
      const error: ApiError = new Error('Not authorized to update this profile');
      error.statusCode = 403;
      throw error;
    }
    
    // Update user
    const updatedUser: User = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      email: email || users[userIndex].email,
      updatedAt: new Date()
    };
    
    // Update password if provided
    if (password) {
      const saltRounds = 10;
      updatedUser.password = await bcrypt.hash(password, saltRounds);
    }
    
    users[userIndex] = updatedUser;
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      status: 'success',
      message: 'Profile updated successfully',
      data: userWithoutPassword
    });
  } catch (err) {
    next(err);
  }
};
