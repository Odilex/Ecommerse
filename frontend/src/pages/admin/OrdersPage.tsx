import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  SearchIcon,
  CheckCircleIcon,
  XCircleIcon,
  TruckIcon,
  DownloadIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface Order {
  _id: string;
  user: {
    name: string;
    email: string;
  };
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentResult: {
    id: string;
    status: string;
    update_time: string;
  };
  itemsPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt: string;
  isDelivered: boolean;
  deliveredAt: string;
  status: string;
  createdAt: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [page, keyword, statusFilter]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(
        `/api/admin/orders?page=${page}&keyword=${keyword}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrders(response.data.orders);
      setPages(response.data.pages);
    } catch (err) {
      setError('Failed to fetch orders');
      console.error('Orders fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await axios.put(
        `/api/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update order status');
      console.error('Order status update error:', err);
    }
  };

  const handleBulkStatusUpdate = async (newStatus: string) => {
    try {
      await axios.put(
        '/api/admin/orders/bulk/status',
        { orderIds: selectedOrders, status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Orders status updated successfully');
      setSelectedOrders([]);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to update orders status');
      console.error('Bulk status update error:', err);
    }
  };

  const handleExport = async (format: 'csv' | 'pdf') => {
    try {
      const response = await axios.get(
        `/api/admin/orders/export?format=${format}&status=${statusFilter}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `orders.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error('Failed to export orders');
      console.error('Export error:', err);
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((order) => order._id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Orders list will go here</p>
      </div>
    </div>
  );
};

export default OrdersPage; 