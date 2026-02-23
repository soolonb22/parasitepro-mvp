import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: async (data: { email: string; password: string; firstName?: string; lastName?: string }) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },
  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const analysisAPI = {
  upload: async (formData: FormData) => {
    const response = await api.post('/analysis/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/analysis/${id}`);
    return response.data;
  },
  getHistory: async (params?: { limit?: number; offset?: number; status?: string; sampleType?: string }) => {
    const response = await api.get('/analysis/user/history', { params });
    return response.data;
  },
};

export const paymentAPI = {
  getPricing: async () => {
    const response = await axios.get(`${API_URL}/payment/pricing`);
    return response.data;
  },
  createIntent: async (credits: number) => {
    const response = await api.post('/payment/create-intent', { credits });
    return response.data;
  },
  confirmPayment: async (paymentIntentId: string) => {
    const response = await api.post('/payment/confirm', { paymentIntentId });
    return response.data;
  },
  getHistory: async () => {
    const response = await api.get('/payment/history');
    return response.data;
  },
};

export default api;
