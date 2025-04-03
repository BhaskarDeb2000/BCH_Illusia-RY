
import express from 'express';
import { 
  getAllItems, 
  getItemById, 
  createItem, 
  updateItem, 
  deleteItem 
} from '../controllers/items.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route GET /api/items
 * @desc Get all items
 * @access Public
 */
router.get('/', getAllItems);

/**
 * @route GET /api/items/:id
 * @desc Get item by ID
 * @access Public
 */
router.get('/:id', getItemById);

/**
 * @route POST /api/items
 * @desc Create a new item
 * @access Private (Admin only)
 */
router.post('/', authenticate, isAdmin, createItem);

/**
 * @route PUT /api/items/:id
 * @desc Update an item
 * @access Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, updateItem);

/**
 * @route DELETE /api/items/:id
 * @desc Delete an item (mark as inactive)
 * @access Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, deleteItem);

export default router;
