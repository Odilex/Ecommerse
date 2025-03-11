import React, { useEffect, useState } from 'react';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface PayPalPaymentProps {
  orderId: string;
  amount: number;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({ orderId, amount }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const createPayPalOrder = async () => {
    try {
      const response = await axios.post(
        '/api/payment/create-paypal-order',
        { orderId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      return response.data.orderId;
    } catch (err) {
      setError('Failed to create PayPal order');
      console.error('PayPal order creation error:', err);
      return null;
    }
  };

  const onApprove = async (data: any) => {
    try {
      await axios.post(
        '/api/payment/capture-paypal-order',
        {
          orderId,
          paypalOrderId: data.orderID,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      setError('Failed to process PayPal payment');
      console.error('PayPal capture error:', err);
    }
  };

  const onError = (err: any) => {
    setError('Payment failed. Please try again.');
    console.error('PayPal error:', err);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Pay with PayPal</h2>
        <p className="text-gray-600">Amount to pay: ${amount.toFixed(2)}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <PayPalScriptProvider
        options={{
          'client-id': process.env.REACT_APP_PAYPAL_CLIENT_ID!,
          currency: 'USD',
        }}
      >
        <PayPalButtons
          createOrder={createPayPalOrder}
          onApprove={onApprove}
          onError={onError}
          style={{ layout: 'vertical' }}
          className="w-full"
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment; 