import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IOrder } from '../types/order';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrder(response.data);
        setPaymentStatus(response.data.isPaid ? 'success' : 'failed');
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
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        {paymentStatus === 'success' ? (
          <div className="flex flex-col items-center">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-3xl font-bold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-gray-600">Thank you for your order. We'll send you a confirmation email shortly.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <XCircleIcon className="h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-3xl font-bold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-gray-600">There was an issue processing your payment. Please try again.</p>
            <button
              onClick={() => navigate(`/payment/${orderId}`)}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Retry Payment
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Order Items</h3>
            <ul className="mt-2 space-y-2">
              {order.orderItems.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Shipping</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Shipping Address</h3>
            <p className="mt-1 text-gray-600">
              {order.shippingAddress.address}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </p>
          </div>

          {order.trackingNumber && (
            <div>
              <h3 className="font-medium">Tracking Information</h3>
              <p className="mt-1 text-gray-600">
                Tracking Number: {order.trackingNumber}
                <br />
                Estimated Delivery: {new Date(order.estimatedDeliveryDate!).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/orders')}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          View All Orders
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmationPage; 