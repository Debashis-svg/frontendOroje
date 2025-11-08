// src/utils/AdminRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Not logged in at all
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== 'admin') {
    // Logged in, but NOT an admin
    // Redirect them to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children; // User is authenticated AND is an admin
};

export default AdminRoute;