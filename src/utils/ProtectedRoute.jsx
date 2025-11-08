// src/utils/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // Show a loading spinner while checking auth status
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location
    // so we can send them back after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // User is authenticated, render the children
};

export default ProtectedRoute;