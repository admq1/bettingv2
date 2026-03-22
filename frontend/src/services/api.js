import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://rudrabett.up.railway.app';
const API_BASE_URL = `${BACKEND_URL}/api`;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Bet APIs
export const betAPI = {
  placeBet: (data) => api.post('/bets/', data),
  getMyBets: (params) => api.get('/bets/my-bets', { params }),
  getBetStats: () => api.get('/bets/stats/summary'),
  getBet: (betId) => api.get(`/bets/${betId}`),
};

// Transaction APIs
export const transactionAPI = {
  getPaymentSettings: () => api.get('/transactions/payment-settings'),
  createDeposit: (amount, method = 'QR Code') => 
    api.post('/transactions/deposit', { amount, method }),
  uploadScreenshot: (transactionId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/transactions/upload-screenshot/${transactionId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  createWithdrawal: (data) => api.post('/transactions/withdraw', data),
  getMyTransactions: (params) => api.get('/transactions/my-transactions', { params }),
  getTransaction: (txId) => api.get(`/transactions/${txId}`),
};

// Admin APIs  
export const adminAPI = {
  login: (data) => api.post('/admin/login', data),
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUserDetails: (userId) => api.get(`/admin/users/${userId}`),
  updateUser: (userId, data) => api.patch(`/admin/users/${userId}`, data),
  getBets: (params) => api.get('/admin/bets', { params }),
  settleBet: (data) => api.post('/admin/bets/settle', data),
  getTransactions: (params) => api.get('/admin/transactions', { params }),
  processTransaction: (data) => api.post('/admin/transactions/action', data),
  getPaymentSettings: () => api.get('/admin/payment-settings'),
  updatePaymentSettings: (data) => api.put('/admin/payment-settings', data),
};

export default api;
