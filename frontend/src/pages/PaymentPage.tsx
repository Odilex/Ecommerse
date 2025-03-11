import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PaymentForm from '../components/PaymentForm';
import PayPalPayment from '../components/PayPalPayment';
import MobileMoneyPayment from '../components/MobileMoneyPayment';
import { IOrder } from '../types/order';

type PaymentMethod = 'stripe' | 'paypal' | 'mobile-money';

const PaymentPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('stripe');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(response.data);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Order fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save payment method to state/context
    navigate('/placeorder');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="p-3 bg-red-100 text-red-700 rounded">
          {error || 'Order not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-6">Payment Method</h1>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div className="flex items-center">
              <input
                type="radio"
                id="credit_card"
                name="paymentMethod"
                value="credit_card"
                checked={selectedPaymentMethod === 'stripe'}
                onChange={(e) => setSelectedPaymentMethod('stripe')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="credit_card" className="ml-2 text-gray-700">
                Credit Card
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="paypal"
                name="paymentMethod"
                value="paypal"
                checked={selectedPaymentMethod === 'paypal'}
                onChange={(e) => setSelectedPaymentMethod('paypal')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="paypal" className="ml-2 text-gray-700">
                PayPal
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="mobile_money"
                name="paymentMethod"
                value="mobile_money"
                checked={selectedPaymentMethod === 'mobile-money'}
                onChange={(e) => setSelectedPaymentMethod('mobile-money')}
                className="h-4 w-4 text-blue-600"
              />
              <label htmlFor="mobile_money" className="ml-2 text-gray-700">
                Mobile Money
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Continue to Place Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage; 