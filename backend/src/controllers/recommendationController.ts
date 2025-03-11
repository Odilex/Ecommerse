import { Response } from 'express';
import { CustomRequest } from '../types';
import {
  getPersonalizedRecommendations,
  getRecommendations,
  getPopularProducts,
} from '../services/recommendationService';

// @desc    Get personalized product recommendations
// @route   GET /api/recommendations/personalized
// @access  Private
export const getPersonalizedRecommendationsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 8;
    const recommendations = await getPersonalizedRecommendations(req.user!._id.toString(), limit);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

// @desc    Get general product recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendationsHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const limit = Number(req.query.limit) || 8;
    const recommendations = await getRecommendations(req.user!._id.toString(), limit);
    res.json(recommendations);
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ message: 'Error getting recommendations' });
  }
};

// @desc    Get popular products
// @route   GET /api/recommendations/popular
// @access  Public
export const getPopularProductsHandler = async (_req: CustomRequest, res: Response): Promise<void> => {
  try {
    const limit = 8;
    const popularProducts = await getPopularProducts(limit);
    res.json(popularProducts);
  } catch (error) {
    console.error('Error getting popular products:', error);
    res.status(500).json({ message: 'Error getting popular products' });
  }
}; 