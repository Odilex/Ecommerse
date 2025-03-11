import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MobileMoneyPaymentProps {
  orderId: string;
  amount: number;
}

const MobileMoneyPayment: React.FC<MobileMoneyPaymentProps> = ({ orderId, amount }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Airtel'>('MTN');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        '/api/payment/mobile-money',
        {
          orderId,
          phoneNumber,
          provider,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success) {
        // Show success message and redirect to order confirmation
        navigate(`/order-confirmation/${orderId}`);
      } else {
        setError(response.data.error || 'Payment failed');
      }
    } catch (err) {
      setError('Failed to process mobile money payment');
      console.error('Mobile money payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Pay with Mobile Money</h2>
        <p className="text-gray-600">Amount to pay: RWF {amount.toFixed(2)}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Provider
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setProvider('MTN')}
              className={`px-4 py-2 rounded ${
                provider === 'MTN'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              MTN Mobile Money
            </button>
            <button
              type="button"
              onClick={() => setProvider('Airtel')}
              className={`px-4 py-2 rounded ${
                provider === 'Airtel'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Airtel Money
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            Enter your {provider} phone number to receive the payment request
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          } text-white font-semibold`}
        >
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>
    </div>
  );
};

export default MobileMoneyPayment; 