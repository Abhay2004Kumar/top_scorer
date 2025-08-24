import axios from 'axios';
import { toast } from 'react-hot-toast';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  timeout: 10000,
  withCredentials: true
});

// Add a request interceptor to add the auth token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache control headers for better caching
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'max-age=300'; // 5 minutes cache
    }
    
    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle various backend responses
axiosInstance.interceptors.response.use(
  (response) => {
    // Log cache information if available
    if (response.data?.source === 'cache') {
      console.log('✅ Data served from cache');
    }
    
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle rate limiting
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'] || 60;
      toast.error(`Too many requests. Please wait ${retryAfter} seconds before trying again.`);
      return Promise.reject(error);
    }

    // Handle 401 errors and token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Try to refresh the token (admin uses same refresh endpoint as users)
        const response = await axios.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/v1/users/refresh-token`,
          { refreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Update tokens in localStorage
        localStorage.setItem('accessToken', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Update the Authorization header
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (error) {
        // If refresh token fails, log the user out
        console.error('Token refresh failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/signin';
        toast.error('Your session has expired. Please log in again.');
        return Promise.reject(error);
      }
    }

    // Handle other errors
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }

    return Promise.reject(error);
  }
);

// API helper functions for admin
export const adminApi = {
  // Admin authentication
  login: (credentials) => axiosInstance.post('/api/v1/admin/login', credentials),
  validateToken: () => axiosInstance.get('/api/v1/admin/validateToken'),
  logout: () => axiosInstance.post('/api/v1/admin/logout'),
  getCurrentAdmin: () => axiosInstance.get('/api/v1/admin/current-admin'),
  
  // Blog management
  getAllBlogs: () => axiosInstance.get('/api/v1/users/getAllblogs'),
  getBlogById: (id) => axiosInstance.get(`/api/v1/users/blog/${id}`),
  createBlog: (blogData) => axiosInstance.post('/api/v1/users/createBlog', blogData),
  updateBlog: (blogData) => axiosInstance.put('/api/v1/users/updateBlog', blogData),
  deleteBlog: (id) => axiosInstance.delete(`/api/v1/users/deleteBlog/${id}`),
  getBlogStats: () => axiosInstance.get('/api/v1/users/blog-stats'),
  
  // Sports management
  getSportsData: () => axiosInstance.get('/api/v1/sports'),
  updateMatchData: (sportType, data) => axiosInstance.post('/api/v1/sports/update', { sportType, data }),
  
  // User management
  getAllUsers: () => axiosInstance.get('/api/v1/admin/users'),
  getUserById: (id) => axiosInstance.get(`/api/v1/admin/users/${id}`),
  updateUser: (id, userData) => axiosInstance.put(`/api/v1/admin/users/${id}`, userData),
  deleteUser: (id) => axiosInstance.delete(`/api/v1/admin/users/${id}`),
  
  // Payment management
  getPaymentStats: () => axiosInstance.get('/api/v1/payment/payment-stats'),
  getPaymentHistory: () => axiosInstance.get('/api/v1/payment/payment-history'),
  
  // System health
  healthCheck: () => axiosInstance.get('/health'),
  
  // Statistics
  getSystemStats: () => axiosInstance.get('/api/v1/admin/stats'),
};

export default axiosInstance;
