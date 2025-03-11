import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual API URL
const API_URL = 'https://api.yourdomain.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { token } = response.data;
        await AsyncStorage.setItem('token', token);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (err) {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        // Handle logout or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (userData: any) => api.post('/auth/register', userData),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

export const productsAPI = {
  getProducts: (params?: any) => api.get('/products', { params }),
  getProduct: (id: string) => api.get(`/products/${id}`),
  getCategories: () => api.get('/categories'),
  getCategoryProducts: (categoryId: string, params?: any) =>
    api.get(`/categories/${categoryId}/products`, { params }),
};

export const storesAPI = {
  getStores: (params?: any) => api.get('/stores', { params }),
  getStore: (id: string) => api.get(`/stores/${id}`),
  getNearbyStores: (lat: number, lng: number, radius: number) =>
    api.get('/stores/nearby', { params: { lat, lng, radius } }),
};

export const ordersAPI = {
  createOrder: (orderData: any) => api.post('/orders', orderData),
  getOrders: () => api.get('/orders'),
  getOrder: (id: string) => api.get(`/orders/${id}`),
  trackOrder: (id: string) => api.get(`/orders/${id}/track`),
};

export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (userData: any) => api.put('/user/profile', userData),
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (address: any) => api.post('/user/addresses', address),
  updateAddress: (id: string, address: any) =>
    api.put(`/user/addresses/${id}`, address),
  deleteAddress: (id: string) => api.delete(`/user/addresses/${id}`),
};

export default api; 