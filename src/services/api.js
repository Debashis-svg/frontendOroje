// src/services/api.js
import axios from 'axios';

// Create the axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

/*
  Add an interceptor to include the auth token.
  The AuthContext will set this token on login.
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;