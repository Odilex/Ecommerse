import express from 'express';
import { protect, vendor, admin } from '../middleware/auth';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  createProductReview,
  getFeaturedProducts,
  searchProducts,
} from '../controllers/productController';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:id', getProductById);

// Protected routes
router.post('/:id/reviews', protect, createProductReview);

// Vendor/Admin routes
router.post('/', protect, vendor, createProduct);
router.put('/:id', protect, vendor, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router; 