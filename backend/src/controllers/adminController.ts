import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Get total number of users
    const totalUsers = await User.countDocuments();

    // Get total number of orders
    const totalOrders = await Order.countDocuments();

    // Get total revenue
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Get total number of products
    const totalProducts = await Product.countDocuments();

    // Get low stock products (less than 10 items)
    const lowStockProducts = await Product.countDocuments({ countInStock: { $lt: 10 } });

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // Get top selling products
    const topSellingProducts = await Product.find()
      .sort({ numReviews: -1, rating: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      lowStockProducts,
      recentOrders,
      topSellingProducts
    });
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    res.status(500).json({ message: 'Error getting dashboard statistics' });
  }
};

// @desc    Get all orders
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { _id: req.query.keyword },
            { user: req.query.keyword },
            { 'shippingAddress.email': req.query.keyword },
          ],
        }
      : {};

    const count = await Order.countDocuments({ ...keyword });
    const orders = await Order.find({ ...keyword })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    const { status } = req.body;
    order.status = status;
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

// @desc    Get all products
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product' });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    await Product.deleteOne({ _id: req.params.id });
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { email: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const count = await User.countDocuments({ ...keyword });
    const users = await User.find({ ...keyword })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      users,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { isAdmin } = req.body;
    user.isAdmin = isAdmin;
    await user.save();

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
}; 