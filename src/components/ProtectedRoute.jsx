// File: src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ role, children }) {
  const storedRole = localStorage.getItem('userRole');

  if (storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
