// src/Pages/AdminRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface Props {
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AdminRoute: React.FC<Props> = ({ isAuthenticated, isAdmin }) => {
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/home" />;
  return <Outlet />;
};

export default AdminRoute;
