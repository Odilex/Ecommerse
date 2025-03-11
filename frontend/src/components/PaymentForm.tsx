import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

interface PaymentFormProps {
  orderId: string;
  amount: number;
}

const PaymentFormContent: React.FC<PaymentFormProps> = ({ orderId, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation/${orderId}`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'An error occurred');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Payment Details</h2>
        <p className="text-gray-600">Amount to pay: ${amount.toFixed(2)}</p>
      </div>

      <PaymentElement className="mb-6" />

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full py-2 px-4 rounded ${
          !stripe || processing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-semibold`}
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const PaymentForm: React.FC<PaymentFormProps> = ({ orderId, amount }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const response = await axios.post(
          '/api/payment/create-payment-intent',
          { orderId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment');
        console.error('Payment intent error:', err);
      }
    };

    getPaymentIntent();
  }, [orderId]);

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">Loading payment form...</div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3b82f6',
            colorBackground: '#ffffff',
            colorText: '#1f2937',
            colorDanger: '#ef4444',
            fontFamily: 'system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px',
          },
        },
      }}
    >
      <PaymentFormContent orderId={orderId} amount={amount} />
    </Elements>
  );
};

export default PaymentForm; 