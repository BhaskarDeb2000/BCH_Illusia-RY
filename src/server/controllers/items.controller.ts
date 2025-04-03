
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { ApiError } from '../middleware/errorHandler';
import { StorageItem } from '../models/types';
import { items, findItemById, findCategoryById, addItem } from '../models/mockData';

export const getAllItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Filter by category
    const { category, tag, search, active } = req.query;
    
    let filteredItems = [...items];
    
    if (category) {
      filteredItems = filteredItems.filter(item => item.categoryId === category);
    }
    
    if (tag) {
      filteredItems = filteredItems.filter(item => item.tags.includes(tag as string));
    }
    
    if (search) {
      const searchLower = (search as string).toLowerCase();
      filteredItems = filteredItems.filter(
        item => 
          item.name.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Default to showing only active items unless explicitly requested
    if (active !== 'false') {
      filteredItems = filteredItems.filter(item => item.isActive);
    }

    res.status(200).json({
      status: 'success',
      results: filteredItems.length,
      data: filteredItems
    });
  } catch (err) {
    next(err);
  }
};

export const getItemById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const item = findItemById(id);
    
    if (!item) {
      const error: ApiError = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    
    res.status(200).json({
      status: 'success',
      data: item
    });
  } catch (err) {
    next(err);
  }
};

export const createItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, quantity, location, imageUrl, categoryId, tags } = req.body;
    
    // Validate required fields
    if (!name || !description || !quantity || !categoryId) {
      const error: ApiError = new Error('Missing required fields');
      error.statusCode = 400;
      throw error;
    }
    
    // Validate category exists
    const category = findCategoryById(categoryId);
    if (!category) {
      const error: ApiError = new Error('Category not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Create new item
    const newItem = addItem({
      name,
      description,
      quantity: Number(quantity),
      location,
      imageUrl,
      categoryId,
      tags: tags || [],
      isActive: true
    });
    
    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (err) {
    next(err);
  }
};

export const updateItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, description, quantity, location, imageUrl, categoryId, tags, isActive } = req.body;
    
    // Find item
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      const error: ApiError = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Validate category if updating
    if (categoryId && categoryId !== items[itemIndex].categoryId) {
      const category = findCategoryById(categoryId);
      if (!category) {
        const error: ApiError = new Error('Category not found');
        error.statusCode = 404;
        throw error;
      }
    }
    
    // Update item
    items[itemIndex] = {
      ...items[itemIndex],
      name: name || items[itemIndex].name,
      description: description || items[itemIndex].description,
      quantity: quantity !== undefined ? Number(quantity) : items[itemIndex].quantity,
      location: location !== undefined ? location : items[itemIndex].location,
      imageUrl: imageUrl !== undefined ? imageUrl : items[itemIndex].imageUrl,
      categoryId: categoryId || items[itemIndex].categoryId,
      tags: tags || items[itemIndex].tags,
      isActive: isActive !== undefined ? isActive : items[itemIndex].isActive,
      updatedAt: new Date()
    };
    
    res.status(200).json({
      status: 'success',
      data: items[itemIndex]
    });
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    // Find item
    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      const error: ApiError = new Error('Item not found');
      error.statusCode = 404;
      throw error;
    }
    
    // Instead of hard delete, mark as inactive
    items[itemIndex] = {
      ...items[itemIndex],
      isActive: false,
      updatedAt: new Date()
    };
    
    res.status(200).json({
      status: 'success',
      message: 'Item deactivated successfully'
    });
  } catch (err) {
    next(err);
  }
};
