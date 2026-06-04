import axios from 'axios';

const API_BASE_URL = 'https://spendwise-m7ol.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const expenseService = {
  getAll: async (params) => {
    const response = await api.get('/expenses', { params });
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },
  create: async (expenseData) => {
    const response = await api.post('/expenses', expenseData);
    return response.data;
  },
  update: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};

export const budgetService = {
  getAll: async () => {
    const response = await api.get('/budgets');
    return response.data;
  },
  create: async (budgetData) => {
    const response = await api.post('/budgets', budgetData);
    return response.data;
  },
  update: async (id, budgetData) => {
    const response = await api.put(`/budgets/${id}`, budgetData);
    return response.data;
  },
};

export const analyticsService = {
  getSummary: async () => {
    const response = await api.get('/summary');
    return response.data;
  },
  getInsights: async () => {
    const response = await api.get('/insights');
    return response.data;
  },
};

export default api;
