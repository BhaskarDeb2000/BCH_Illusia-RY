
import express from 'express';
import { 
  getAllUsers, 
  getUserById, 
  approveUser, 
  toggleUserActive,
  updateUserRole,
  updateUserProfile
} from '../controllers/users.controller';
import { authenticate, isAdmin, isSuperAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route GET /api/users
 * @desc Get all users
 * @access Private (Admin only)
 */
router.get('/', authenticate, isAdmin, getAllUsers);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 * @access Private (Admin or self)
 */
router.get('/:id', authenticate, getUserById);

/**
 * @route PATCH /api/users/:id/approve
 * @desc Approve a new user
 * @access Private (Admin only)
 */
router.patch('/:id/approve', authenticate, isAdmin, approveUser);

/**
 * @route PATCH /api/users/:id/toggle-active
 * @desc Activate or deactivate a user
 * @access Private (Admin only)
 */
router.patch('/:id/toggle-active', authenticate, isAdmin, toggleUserActive);

/**
 * @route PATCH /api/users/:id/role
 * @desc Update user role
 * @access Private (Super Admin only)
 */
router.patch('/:id/role', authenticate, isSuperAdmin, updateUserRole);

/**
 * @route PUT /api/users/:id
 * @desc Update user profile
 * @access Private (Self or admin)
 */
router.put('/:id', authenticate, updateUserProfile);

export default router;
