import Product from '../models/Product';
import Order, { OrderItem } from '../models/Order';
import { Types } from 'mongoose';

interface UserPreferences {
  categories: Set<string>;
  brands: Set<string>;
}

export const getRecommendations = async (userId: string, limit: number = 5) => {
  try {
    // Get products that other users also bought
    const userOrders = await Order.find({ user: userId });
    const purchasedProductIds = userOrders.flatMap(order => 
      order.orderItems.map((item: OrderItem) => item.product)
    );

    // Find orders containing these products from other users
    const relatedOrders = await Order.find({
      user: { $ne: new Types.ObjectId(userId) },
      'orderItems.product': { $in: purchasedProductIds },
    }).populate('orderItems.product');

    // Get products from these orders
    const relatedProductIds = new Set(
      relatedOrders.flatMap(order => 
        order.orderItems
          .filter((item: OrderItem) => !purchasedProductIds.some(id => id.equals(item.product)))
          .map((item: OrderItem) => item.product.toString())
      )
    );

    // Get the actual products
    const recommendations = await Product.find({
      _id: { $in: Array.from(relatedProductIds) },
      countInStock: { $gt: 0 },
      isActive: true,
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error('Error getting recommendations:', error);
    throw error;
  }
};

export const getPersonalizedRecommendations = async (userId: string, limit: number = 5) => {
  try {
    // Get user's order history
    const userOrders = await Order.find({ user: userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 });

    // Get categories and brands the user has purchased
    const userPreferences = userOrders.reduce<UserPreferences>((prefs, order) => {
      order.orderItems.forEach((item: OrderItem & { product: any }) => {
        const product = item.product;
        if (product) {
          prefs.categories.add(product.category);
          prefs.brands.add(product.brand);
        }
      });
      return prefs;
    }, { categories: new Set<string>(), brands: new Set<string>() });

    // Find similar products based on user preferences
    const recommendations = await Product.find({
      $or: [
        { category: { $in: Array.from(userPreferences.categories) } },
        { brand: { $in: Array.from(userPreferences.brands) } },
      ],
      countInStock: { $gt: 0 },
      isActive: true,
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit);

    return recommendations;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    throw error;
  }
};

export async function getPopularProducts(limit: number) {
  try {
    // Get products with highest ratings and most reviews
    const popularProducts = await Product.find({
      countInStock: { $gt: 0 },
      isActive: true,
    })
      .sort({ rating: -1, numReviews: -1 })
      .limit(limit);

    return popularProducts;
  } catch (error) {
    console.error('Error getting popular products:', error);
    throw error;
  }
} 