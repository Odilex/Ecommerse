import Stripe from 'stripe';
import { IOrder } from '../models/Order';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-02-24.acacia',
});

export const createPaymentIntent = async (order: IOrder) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order._id.toString(),
        userId: order.user.toString(),
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent creation error:', error);
    throw new Error('Error creating payment intent');
  }
};

export const handleWebhook = async (payload: string, signature: string) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables');
  }

  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        return {
          type: 'payment_intent.succeeded',
          orderId: paymentIntent.metadata.orderId,
          paymentId: paymentIntent.id,
          status: paymentIntent.status,
          update_time: new Date().toISOString(),
          email_address: paymentIntent.receipt_email,
        };
      case 'payment_intent.payment_failed':
        return {
          type: 'payment_intent.payment_failed',
          orderId: (event.data.object as Stripe.PaymentIntent).metadata.orderId,
        };
      default:
        return null;
    }
  } catch (error) {
    console.error('Stripe webhook handling error:', error);
    throw new Error('Error handling webhook');
  }
}; 