
import express from 'express';
import { 
  getAllCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  getAllTags,
  createTag,
  deleteTag
} from '../controllers/categories.controller';
import { authenticate, isAdmin } from '../middleware/auth.middleware';

const router = express.Router();

/**
 * @route GET /api/categories
 * @desc Get all categories
 * @access Public
 */
router.get('/', getAllCategories);

/**
 * @route GET /api/categories/:id
 * @desc Get category by ID
 * @access Public
 */
router.get('/:id', getCategoryById);

/**
 * @route POST /api/categories
 * @desc Create a new category
 * @access Private (Admin only)
 */
router.post('/', authenticate, isAdmin, createCategory);

/**
 * @route PUT /api/categories/:id
 * @desc Update a category
 * @access Private (Admin only)
 */
router.put('/:id', authenticate, isAdmin, updateCategory);

/**
 * @route DELETE /api/categories/:id
 * @desc Delete a category
 * @access Private (Admin only)
 */
router.delete('/:id', authenticate, isAdmin, deleteCategory);

/**
 * @route GET /api/categories/tags
 * @desc Get all tags
 * @access Public
 */
router.get('/tags/all', getAllTags);

/**
 * @route POST /api/categories/tags
 * @desc Create a new tag
 * @access Private (Admin only)
 */
router.post('/tags', authenticate, isAdmin, createTag);

/**
 * @route DELETE /api/categories/tags/:id
 * @desc Delete a tag
 * @access Private (Admin only)
 */
router.delete('/tags/:id', authenticate, isAdmin, deleteTag);

export default router;
