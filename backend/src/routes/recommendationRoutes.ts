import express from 'express';
import { protect } from '../middleware/auth';
import {
  getPersonalizedRecommendationsHandler,
  getRecommendationsHandler,
  getPopularProductsHandler,
} from '../controllers/recommendationController';

const router = express.Router();

// Protected routes
router.use(protect);

router.get('/personalized', getPersonalizedRecommendationsHandler);
router.get('/', getRecommendationsHandler);

// Public route
router.get('/popular', getPopularProductsHandler);

export default router; 