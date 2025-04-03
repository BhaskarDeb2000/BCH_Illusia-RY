
import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ApiError } from '../middleware/errorHandler';
import { Booking, BookingStatus, BookingItem } from '../models/types';
import { 
  bookings, 
  findBookingById, 
  findBookingsByUserId, 
  findItemById,
  addBooking 
} from '../models/mockData';

export const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Filter by status if requested
    const { status } = req.query;
    let filteredBookings = [...bookings];
    
    if (status) {
      filteredBookings = filteredBookings.filter(booking => booking.status === status);
    }
    
    res.status(200).json({
      status: 'success',
      results: filteredBookings.length,
      data: filteredBookings
    });
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.id) {
      const error: ApiError = new Error('User not authenticated');
      error.statusCode = 401;
      throw error;
    }
    
    const userBookings = findBookingsByUserId(req.user.id);
    
    res.status(200).json({
      status: 'success',
      results: userBookings.length,
      data: userBookings
    });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const booking = findBookingById(id);
    
    if (!booking) {
      const error: ApiError = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check authorization (user can only view their own bookings, admins can view any)
    if (
      req.user?.id !== booking.userId && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'superAdmin'
    ) {
      const error: ApiError = new Error('Not authorized to view this booking');
      error.statusCode = 403;
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

export const createBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { items, startDate, endDate, notes } = req.body;
    
    if (!req.user?.id) {
      const error: ApiError = new Error('User not authenticated');
      error.statusCode = 401;
      throw error;
    }
    
    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0 || !startDate || !endDate) {
      const error: ApiError = new Error('Missing required booking information');
      error.statusCode = 400;
      throw error;
    }
    
    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      const error: ApiError = new Error('Invalid date format');
      error.statusCode = 400;
      throw error;
    }
    
    // Ensure end date is after start date
    if (end <= start) {
      const error: ApiError = new Error('End date must be after start date');
      error.statusCode = 400;
      throw error;
    }
    
    // Ensure booking duration is no more than 2 weeks (14 days)
    const durationInMs = end.getTime() - start.getTime();
    const durationInDays = durationInMs / (1000 * 60 * 60 * 24);
    
    if (durationInDays > 14) {
      const error: ApiError = new Error('Booking duration cannot exceed 2 weeks');
      error.statusCode = 400;
      throw error;
    }
    
    // Validate items
    for (const item of items) {
      if (!item.itemId || item.quantity <= 0) {
        const error: ApiError = new Error('Invalid item data');
        error.statusCode = 400;
        throw error;
      }
      
      const storageItem = findItemById(item.itemId);
      if (!storageItem) {
        const error: ApiError = new Error(`Item with ID ${item.itemId} not found`);
        error.statusCode = 404;
        throw error;
      }
      
      if (!storageItem.isActive) {
        const error: ApiError = new Error(`Item "${storageItem.name}" is not available for booking`);
        error.statusCode = 400;
        throw error;
      }
      
      if (item.quantity > storageItem.quantity) {
        const error: ApiError = new Error(`Requested quantity for "${storageItem.name}" exceeds available stock`);
        error.statusCode = 400;
        throw error;
      }
    }
    
    // Check for availability (no conflicting bookings for the same items)
    const conflictingBookings = checkBookingConflicts(items as BookingItem[], start, end);
    if (conflictingBookings.length > 0) {
      const error: ApiError = new Error('Some items are already booked for the selected dates');
      error.statusCode = 409;
      throw error;
    }
    
    // Create booking
    const newBooking = addBooking({
      userId: req.user.id,
      items: items as BookingItem[],
      startDate: start,
      endDate: end,
      status: BookingStatus.PENDING,
      notes: notes || undefined
    });
    
    res.status(201).json({
      status: 'success',
      data: newBooking
    });
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    if (!status || !Object.values(BookingStatus).includes(status)) {
      const error: ApiError = new Error('Valid status is required');
      error.statusCode = 400;
      throw error;
    }
    
    // Find booking
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) {
      const error: ApiError = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }
    
    const booking = bookings[bookingIndex];
    
    // Check authorization
    if (req.user?.role !== 'admin' && req.user?.role !== 'superAdmin') {
      // Regular users can only cancel their own bookings
      if (
        req.user?.id !== booking.userId || 
        (status !== BookingStatus.CANCELLED && booking.status !== BookingStatus.PENDING)
      ) {
        const error: ApiError = new Error('Not authorized to update this booking');
        error.statusCode = 403;
        throw error;
      }
    }
    
    // Update booking status
    bookings[bookingIndex] = {
      ...booking,
      status: status as BookingStatus,
      updatedAt: new Date()
    };
    
    res.status(200).json({
      status: 'success',
      message: `Booking ${status.toLowerCase()} successfully`,
      data: bookings[bookingIndex]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteBooking = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Find booking
    const bookingIndex = bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) {
      const error: ApiError = new Error('Booking not found');
      error.statusCode = 404;
      throw error;
    }
    
    const booking = bookings[bookingIndex];
    
    // Check authorization
    if (
      req.user?.id !== booking.userId && 
      req.user?.role !== 'admin' && 
      req.user?.role !== 'superAdmin'
    ) {
      const error: ApiError = new Error('Not authorized to delete this booking');
      error.statusCode = 403;
      throw error;
    }
    
    // Users can only delete pending bookings
    if (req.user?.role !== 'admin' && req.user?.role !== 'superAdmin') {
      if (booking.status !== BookingStatus.PENDING) {
        const error: ApiError = new Error('Can only delete pending bookings');
        error.statusCode = 400;
        throw error;
      }
    }
    
    // Remove booking
    bookings.splice(bookingIndex, 1);
    
    res.status(200).json({
      status: 'success',
      message: 'Booking deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Helper function to check if there are any conflicting bookings
function checkBookingConflicts(
  requestedItems: BookingItem[], 
  startDate: Date, 
  endDate: Date
): string[] {
  const conflictingItems: string[] = [];
  
  for (const item of requestedItems) {
    let availableQuantity = findItemById(item.itemId)?.quantity || 0;
    
    // Check all approved or pending bookings for conflicts
    const relevantBookings = bookings.filter(booking => 
      (booking.status === BookingStatus.APPROVED || booking.status === BookingStatus.PENDING) &&
      // Check for date overlap
      ((startDate <= new Date(booking.endDate) && endDate >= new Date(booking.startDate)))
    );
    
    // Calculate how many of this item are booked during the requested period
    for (const booking of relevantBookings) {
      const bookedItem = booking.items.find(i => i.itemId === item.itemId);
      if (bookedItem) {
        availableQuantity -= bookedItem.quantity;
      }
    }
    
    // If not enough quantity is available
    if (availableQuantity < item.quantity) {
      const itemName = findItemById(item.itemId)?.name || item.itemId;
      conflictingItems.push(itemName);
    }
  }
  
  return conflictingItems;
}
