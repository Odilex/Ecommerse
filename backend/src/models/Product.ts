import mongoose from 'mongoose';

interface Review {
  user: mongoose.Types.ObjectId;
  name: string;
  rating: number;
  comment: string;
}

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  images: string[];
  reviews: Review[];
  vendor: mongoose.Types.ObjectId;
  isActive: boolean;
}

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  countInStock: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: {
    type: Number,
    required: true,
    default: 0,
  },
  numReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  images: [{
    type: String,
    required: true,
  }],
  reviews: [reviewSchema],
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 