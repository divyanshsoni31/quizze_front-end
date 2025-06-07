// File: src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children, allowedRoles }) {
  const role = localStorage.getItem('userRole');

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" />;
  }

  return children;
}
