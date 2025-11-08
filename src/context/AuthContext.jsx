// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your centralized axios instance

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for token in localStorage on app load
    const token = localStorage.getItem('token');
    if (token) {
      // Set the token in our api instance
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Fetch the user data
      api.get('/auth/me') // You'll need to create this backend route
         .then(res => {
           setUser(res.data.user);
         })
         .catch(() => {
           // Token is invalid or expired
           localStorage.removeItem('token');
           localStorage.removeItem('user');
           navigate('/login');
         })
         .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const login = (userData, token) => {
    // 1. Store token and user
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    // 2. Set token for all future api requests
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    // 3. Set user state
    setUser(userData);
    
    // 4. Redirect based on role
    if (userData.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  const logout = () => {
    // 1. Clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // 2. Clear token from api
    delete api.defaults.headers.common['Authorization'];
    // 3. Clear user state
    setUser(null);
    // 4. Redirect to login
    navigate('/login');
  };

  const authValues = {
    user,
    login,
    logout,
    loading,
    isAuthenticated: !!user, // True if user is not null
  };

  return (
    <AuthContext.Provider value={authValues}>
      {!loading && children} 
    </AuthContext.Provider>
  );
};

export default AuthContext;