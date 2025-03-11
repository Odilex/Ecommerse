import { Response } from 'express';
import { CustomRequest } from '../types';
import Cart from '../models/Cart';
import Product from '../models/Product';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id }).populate('items.product');

    if (!cart) {
      res.status(200).json({ items: [] });
      return;
    }

    res.status(200).json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { productId, quantity } = req.body;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if quantity is available
    if (product.countInStock < quantity) {
      res.status(400).json({ message: 'Product is out of stock' });
      return;
    }

    let cart = await Cart.findOne({ user: req.user!._id });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({
        user: req.user!._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      // Check if product exists in cart
      const existingItem = cart.items.find(
        item => item.product.toString() === productId
      );

      if (existingItem) {
        // Update quantity if product exists
        existingItem.quantity = quantity;
      } else {
        // Add new item if product doesn't exist in cart
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    // Populate product details
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if quantity is available
    if (product.countInStock < quantity) {
      res.status(400).json({ message: 'Product is out of stock' });
      return;
    }

    const cart = await Cart.findOne({ user: req.user!._id });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    const cartItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (!cartItem) {
      res.status(404).json({ message: 'Item not found in cart' });
      return;
    }

    cartItem.quantity = quantity;
    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user!._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();
    await cart.populate('items.product');

    res.status(200).json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const cart = await Cart.findOne({ user: req.user!._id });

    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }

    cart.items = [];
    await cart.save();

    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 