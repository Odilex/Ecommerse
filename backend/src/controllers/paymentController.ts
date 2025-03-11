import { Response, Request } from 'express';
import { CustomRequest } from '../types';
import Order from '../models/Order';
import Stripe from 'stripe';
import { initiateMobileMoneyPayment, handleMobileMoneyCallback } from '../services/paymentMethodsService';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

// @desc    Create payment intent
// @route   POST /api/payment/create-payment-intent
// @access  Private
export const createPaymentIntent = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({ message: 'Stripe is not configured' });
      return;
    }

    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if the user is authorized to pay for this order
    if (order.user.toString() !== req.user!._id.toString()) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    // Check if order is already paid
    if (order.isPaid) {
      res.status(400).json({ message: 'Order is already paid' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user!._id.toString(),
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// @desc    Webhook handler for Stripe events
// @route   POST /api/payment/webhook
// @access  Public
export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!stripe) {
      res.status(500).json({ message: 'Stripe is not configured' });
      return;
    }

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      res.status(500).json({ message: 'Stripe webhook secret is not configured' });
      return;
    }

    const sig = req.headers['stripe-signature'];
    if (!sig) {
      res.status(400).json({ message: 'No Stripe signature found' });
      return;
    }

    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        const order = await Order.findById(orderId);
        if (!order) {
          console.error(`Order not found: ${orderId}`);
          break;
        }

        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'processing';
        order.paymentResult = {
          id: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email || '',
        };

        await order.save();
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.error(`Payment failed for order: ${paymentIntent.metadata.orderId}`);
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ message: 'Webhook error' });
  }
};

// @desc    Initiate mobile money payment
// @route   POST /api/payment/mobile-money
// @access  Private
export const initiateMobileMoneyPaymentHandler = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const { orderId, phoneNumber, provider } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      res.status(404).json({ message: 'Order not found' });
      return;
    }

    // Check if the user is authorized to pay for this order
    if (order.user.toString() !== req.user!._id.toString()) {
      res.status(403).json({ message: 'Not authorized to pay for this order' });
      return;
    }

    const result = await initiateMobileMoneyPayment(order, phoneNumber, provider);
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Mobile money payment error:', error);
    res.status(500).json({ message: 'Error initiating mobile money payment' });
  }
};

// @desc    Handle mobile money callback
// @route   POST /api/payment/mobile-money-callback
// @access  Public
export const handleMobileMoneyCallbackHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { provider, data } = req.body;
    const result = await handleMobileMoneyCallback(provider, data);
    
    if (result.success) {
      res.json(result);
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    console.error('Mobile money callback error:', error);
    res.status(500).json({ message: 'Error handling mobile money callback' });
  }
}; 