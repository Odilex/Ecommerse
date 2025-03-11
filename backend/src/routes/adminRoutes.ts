import express from 'express';
import { protect, admin } from '../middleware/auth';
import {
  getDashboardStats,
  getAllOrders,
  updateOrderStatus,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/adminController';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect, admin);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Order Management
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

// Product Management
router.get('/products', getAllProducts);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router; 