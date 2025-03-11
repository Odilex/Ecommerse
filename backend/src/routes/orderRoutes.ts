import express from 'express';
import { protect, admin } from '../middleware/auth';
import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  updateOrderToDelivered,
  cancelOrder,
} from '../controllers/orderController';

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/')
  .post(createOrder);

router.route('/myorders')
  .get(getMyOrders);

router.route('/:id')
  .get(getOrderById);

router.route('/:id/pay')
  .put(updateOrderToPaid);

router.route('/:id/deliver')
  .put(admin, updateOrderToDelivered);

router.route('/:id/cancel')
  .put(cancelOrder);

export default router; 