import express from 'express';
import { protect } from '../middleware/auth';
import {
  createPaymentIntent,
  handleWebhook,
  initiateMobileMoneyPaymentHandler,
  handleMobileMoneyCallbackHandler,
} from '../controllers/paymentController';

const router = express.Router();

// Protected routes
router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/mobile-money', protect, initiateMobileMoneyPaymentHandler);

// Public webhook routes
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);
router.post('/mobile-money-callback', handleMobileMoneyCallbackHandler);

export default router; 