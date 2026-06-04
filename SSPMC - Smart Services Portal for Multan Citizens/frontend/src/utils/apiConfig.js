import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const attachAuthToken = (config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(
  attachAuthToken,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => {
    const refreshToken = response.headers['x-refresh-token'];
    if (refreshToken) {
      localStorage.setItem('token', refreshToken);
      api.defaults.headers.common.Authorization = `Bearer ${refreshToken}`;
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common.Authorization;
    }
    return Promise.reject(error);
  },
);

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('data:') || path.startsWith('http')) return path;
  return `${API_BASE_URL}${path}`;
};

export { API_BASE_URL };
export default api;
