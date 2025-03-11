import { Response } from 'express';
import { CustomRequest } from '../types';
import Product from '../models/Product';

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Vendor
export const createProduct = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      countInStock,
      images,
    } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      brand,
      countInStock,
      images,
      vendor: req.user!._id,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all products with filters and pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const pageSize = 10;
    const page = Number(req.query.page) || 1;
    const keyword = req.query.keyword
      ? {
          $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },
            { description: { $regex: req.query.keyword, $options: 'i' } },
          ],
        }
      : {};

    const count = await Product.countDocuments({ ...keyword });
    const products = await Product.find({ ...keyword })
      .populate('vendor', 'name')
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .sort({ createdAt: -1 });

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (_req: CustomRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, numReviews: -1 })
      .limit(8)
      .populate('vendor', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get products by category
// @route   GET /api/products/category/:categoryId
// @access  Public
export const getProductsByCategory = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
      isActive: true,
    }).populate('vendor', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Search products
// @route   GET /api/products/search
// @access  Public
export const searchProducts = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { q, category, minPrice, maxPrice, sort } = req.query;

    const query: any = { isActive: true };

    if (q) {
      query.$text = { $search: q as string };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const products = await Product.find(query)
      .sort(sortOption)
      .populate('vendor', 'name');

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('vendor', 'name email')
      .populate('reviews.user', 'name');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Vendor
export const updateProduct = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if the user is the vendor of the product or an admin
    if (product.vendor.toString() !== req.user!._id.toString() && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Not authorized to update this product' });
      return;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (review: { user: { toString: () => string } }) => 
        review.user.toString() === req.user!._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400).json({ message: 'Product already reviewed' });
      return;
    }

    const review = {
      user: req.user!._id,
      name: req.user!.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc: number, item: { rating: number }) => 
        item.rating + acc, 0
      ) / product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 