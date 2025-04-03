
import express from 'express';
import { 
  getAllBookings, 
  getMyBookings,
  getBookingById, 
  createBooking, 
  updateBookingStatus, 
  deleteBooking 
} from '../controllers/bookings.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route GET /api/bookings
 * @desc Get all bookings (admin only)
 * @access Private (Admin only)
 */
router.get('/', authenticate, isAdmin, getAllBookings);

/**
 * @route GET /api/bookings/me
 * @desc Get user's bookings
 * @access Private
 */
router.get('/me', authenticate, getMyBookings);

/**
 * @route GET /api/bookings/:id
 * @desc Get booking by ID
 * @access Private
 */
router.get('/:id', authenticate, getBookingById);

/**
 * @route POST /api/bookings
 * @desc Create a new booking
 * @access Private
 */
router.post('/', authenticate, createBooking);

/**
 * @route PATCH /api/bookings/:id/status
 * @desc Update booking status
 * @access Private
 */
router.patch('/:id/status', authenticate, updateBookingStatus);

/**
 * @route DELETE /api/bookings/:id
 * @desc Delete a booking
 * @access Private
 */
router.delete('/:id', authenticate, deleteBooking);

export default router;
