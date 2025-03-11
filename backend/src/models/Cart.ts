import mongoose from 'mongoose';

export interface CartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICart extends mongoose.Document {
  user: mongoose.Types.ObjectId;
  items: CartItem[];
}

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model<ICart>('Cart', cartSchema);

export default Cart; 