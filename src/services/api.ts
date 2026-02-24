// api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log('[API] Interceptor running. Token:', token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('[API] Authorization header set:', config.headers.Authorization);
  }
  return config;
});

// Handle expired/invalid tokens globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && (error.response.status === 401 || error.response.data?.error === 'No token provided.')) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

// Utility for logout
export function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}

export default api;
