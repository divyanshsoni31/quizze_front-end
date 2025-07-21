import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // 🔐 If token doesn't exist, user is not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 If role is required and doesn't match
  if (role && userRole?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  // ✅ Authorized, render the page
  return children;
};

export default ProtectedRoute;
