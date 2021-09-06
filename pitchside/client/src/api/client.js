import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 12000,
});

// Attach JWT if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pitchside_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Surface server-shaped errors.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || err.message || 'Request failed';
    err.userMessage = msg;
    return Promise.reject(err);
  }
);

export default api;
