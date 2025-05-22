import { Router } from 'express';
import { ProfileController } from '../controllers/profile.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const profileController = new ProfileController();

// Get user profile
router.get('/', authenticateToken, profileController.getProfile);

// Update user profile
router.put('/', authenticateToken, profileController.updateProfile);

export default router; 