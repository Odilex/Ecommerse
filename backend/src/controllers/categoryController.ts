import { Request, Response } from 'express';
import { Category } from '../models/Category';

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, image, parent } = req.body;

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      res.status(400).json({ message: 'Category already exists' });
      return;
    }

    const category = await Category.create({
      name,
      description,
      image,
      parent,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find({ parent: null })
      .populate('subcategories')
      .sort({ order: 1 });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Public
export const getCategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('subcategories')
      .populate('products');

    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get subcategories of a category
// @route   GET /api/categories/:id/subcategories
// @access  Public
export const getSubcategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const subcategories = await Category.find({ parent: req.params.id })
      .populate('products')
      .sort({ order: 1 });

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    ).populate('subcategories');

    res.json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }

    // Check if category has subcategories
    const hasSubcategories = await Category.exists({ parent: req.params.id });
    if (hasSubcategories) {
      res.status(400).json({ message: 'Cannot delete category with subcategories' });
      return;
    }

    await category.deleteOne();
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 