import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import recommendationRoutes from './routes/recommendationRoutes';
import adminRoutes from './routes/adminRoutes';
import { errorHandler } from './middleware/error';
import { checkRequiredEnvVars } from './utils/checkEnv';

// Load environment variables
dotenv.config();

// Check required environment variables
checkRequiredEnvVars();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());

// Handle Stripe webhook raw body
app.use('/api/payment/webhook', express.raw({ type: 'application/json' }));

// Handle JSON body for other routes
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Error handling middleware
app.use(errorHandler);

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 