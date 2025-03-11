import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  CubeIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Card,
  Title,
  Text,
  Tab,
  TabList,
  TabGroup,
  TabPanels,
  TabPanel,
} from '@tremor/react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  revenueChange: number;
  ordersChange: number;
  productsChange: number;
  usersChange: number;
  recentOrders: Array<{
    _id: string;
    totalPrice: number;
    createdAt: string;
    status: string;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    countInStock: number;
  }>;
  revenueData: Array<{
    date: string;
    revenue: number;
  }>;
  categoryData: Array<{
    category: string;
    count: number;
  }>;
}

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardStats();
  }, [timeRange]);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(`/api/admin/dashboard?timeRange=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setStats(response.data);
    } catch (err) {
      setError('Failed to fetch dashboard statistics');
      console.error('Dashboard stats error:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    change: number;
    icon: React.ReactNode;
  }> = ({ title, value, change, icon }) => (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <Text className="text-gray-500">{title}</Text>
          <Title className="mt-2 text-2xl font-bold">
            {title.includes('Revenue') ? `RWF ${value.toLocaleString()}` : value.toLocaleString()}
          </Title>
        </div>
        <div className="p-3 bg-blue-50 rounded-full">{icon}</div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <ArrowUpIcon className="h-5 w-5 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-5 w-5 text-red-500" />
        )}
        <Text className={`ml-1 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}% from last {timeRange}
        </Text>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">No data available</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-gray-400" />
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={stats.totalRevenue}
          change={stats.revenueChange}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-blue-500" />}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          change={stats.ordersChange}
          icon={<ShoppingCartIcon className="h-6 w-6 text-blue-500" />}
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          change={stats.productsChange}
          icon={<CubeIcon className="h-6 w-6 text-blue-500" />}
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          change={stats.usersChange}
          icon={<UserGroupIcon className="h-6 w-6 text-blue-500" />}
        />
      </div>

      {/* Charts */}
      <TabGroup>
        <TabList className="mt-8">
          <Tab>Revenue Overview</Tab>
          <Tab>Category Distribution</Tab>
          <Tab>Recent Activity</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Card className="mt-6">
              <Title>Revenue Over Time</Title>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats.revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#3B82F6"
                      fill="#93C5FD"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <Card className="mt-6">
              <Title>Products by Category</Title>
              <div className="h-80 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </TabPanel>
          <TabPanel>
            <div className="mt-6 space-y-6">
              {/* Recent Orders */}
              <Card>
                <Title>Recent Orders</Title>
                <div className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amount
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recentOrders.map((order) => (
                          <tr key={order._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order._id.slice(-6)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              RWF {order.totalPrice.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : order.status === 'processing'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              {/* Low Stock Products */}
              <Card>
                <Title>Low Stock Products</Title>
                <div className="mt-4">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Product
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stock
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {stats.lowStockProducts.map((product) => (
                          <tr key={product._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {product.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.countInStock}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default DashboardPage; 