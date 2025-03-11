import express from 'express';
import { protect, admin } from '../middleware/auth';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getSubcategories,
} from '../controllers/categoryController';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.get('/:id/subcategories', getSubcategories);

// Admin routes
router.post('/', protect, admin, createCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router; 