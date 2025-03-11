import { Response } from 'express';
import { CustomRequest } from '../types';
import Order, { OrderStatus } from '../models/Order';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // Calculate prices
    const itemsPrice = orderItems.reduce(
      (acc: number, item: { price: number; quantity: number }) => 
        acc + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 100 ? 0 : 10;
    const totalPrice = itemsPrice + shippingPrice;

    const order = await Order.create({
      user: req.user!._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      status: 'pending' as OrderStatus,
    });

    // Clear the user's cart after order creation
    await Cart.findOneAndDelete({ user: req.user!._id });

    // Update product stock
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name countInStock');

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if the user is authorized to view this order
    if (order.user._id.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing' as OrderStatus;
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const orders = await Order.find({ user: req.user!._id })
      .sort({ createdAt: -1 })
      .populate('orderItems.product', 'name image');
    res.json(orders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if user is admin
    if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    order.isDelivered = true;
    order.deliveredAt = new Date();
    order.status = 'delivered' as OrderStatus;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Update order delivery error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const pageSize = 20;
    const page = Number(req.query.page) || 1;

    const count = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      orders,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if the user is authorized to cancel this order
    if (order.user.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to cancel this order' });
      return;
    }

    // Only allow cancellation of pending or processing orders
    if (!['pending', 'processing'].includes(order.status)) {
      res.status(400).json({ message: 'Order cannot be cancelled' });
      return;
    }

    // Restore product stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled' as OrderStatus;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    order.status = status;
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 