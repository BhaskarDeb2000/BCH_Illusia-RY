
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../middleware/errorHandler';
import { Category, Tag } from '../models/types';
import { categories, tags } from '../models/mockData';

export const getAllCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'success',
      results: categories.length,
      data: categories
    });
  } catch (err) {
    next(err);
  }
};

export const getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = categories.find(cat => cat.id === id);
    
    if (!category) {
      const error: ApiError = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: category
    });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      const error: ApiError = new Error('Category name is required');
      error.statusCode = 400;
      throw error;
    }
    
    // Check for duplicate names
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
      const error: ApiError = new Error('Category with this name already exists');
      error.statusCode = 409;
      throw error;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    categories.push(newCategory);
    
    res.status(201).json({
      status: 'success',
      data: newCategory
    });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      const error: ApiError = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check for duplicate names if name is being changed
    if (
      name && 
      name !== categories[categoryIndex].name && 
      categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())
    ) {
      const error: ApiError = new Error('Category with this name already exists');
      error.statusCode = 409;
      throw error;
    }
    
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      description: description !== undefined ? description : categories[categoryIndex].description,
      updatedAt: new Date()
    };
    
    res.status(200).json({
      status: 'success',
      data: categories[categoryIndex]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const categoryIndex = categories.findIndex(cat => cat.id === id);
    
    if (categoryIndex === -1) {
      const error: ApiError = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Check if category is in use
    const categoryInUse = items.some(item => item.categoryId === id);
    
    if (categoryInUse) {
      const error: ApiError = new Error('Cannot delete category that is in use by items');
      error.statusCode = 400;
      throw error;
    }
    
    categories.splice(categoryIndex, 1);
    
    res.status(200).json({
      status: 'success',
      message: 'Category deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Tag related controllers
export const getAllTags = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      status: 'success',
      results: tags.length,
      data: tags
    });
  } catch (err) {
    next(err);
  }
};

export const createTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    
    if (!name) {
      const error: ApiError = new Error('Tag name is required');
      error.statusCode = 400;
      throw error;
    }
    
    // Check for duplicate names
    if (tags.some(tag => tag.name.toLowerCase() === name.toLowerCase())) {
      const error: ApiError = new Error('Tag with this name already exists');
      error.statusCode = 409;
      throw error;
    }
    
    const newTag: Tag = {
      id: uuidv4(),
      name: name.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tags.push(newTag);
    
    res.status(201).json({
      status: 'success',
      data: newTag
    });
  } catch (err) {
    next(err);
  }
};

export const deleteTag = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const tagIndex = tags.findIndex(tag => tag.id === id);
    
    if (tagIndex === -1) {
      const error: ApiError = new Error('Tag not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Remove tag from all items
    items.forEach(item => {
      item.tags = item.tags.filter(tagId => tagId !== id);
    });
    
    // Delete the tag
    tags.splice(tagIndex, 1);
    
    res.status(200).json({
      status: 'success',
      message: 'Tag deleted successfully'
    });
  } catch (err) {
    next(err);
  }
};

// Import items for the delete function
import { items } from '../models/mockData';
