// src/Pages/AdminRoute.tsx
// Componente que protege rutas exclusivas para usuarios administradores

import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const AdminRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);           // Estado de carga inicial
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Usuario logueado
  const [isAdmin, setIsAdmin] = useState(false);           // Usuario con rol de admin

  // Al montar el componente, verifica autenticación y rol
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si no hay token, no está autenticado
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Verifica el usuario actual mediante el endpoint /auth/me
    fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado"); // Error HTTP
        return res.json();
      })
      .then((data) => {
        setIsAuthenticated(true);
        setIsAdmin(data.user.admin === true); // Verifica si es administrador
      })
      .catch(() => {
        // En caso de error, no está autenticado ni es admin
        setIsAuthenticated(false);
        setIsAdmin(false);
      })
      .finally(() => {
        setLoading(false); // Finaliza carga
      });
  }, []);

  // Mientras verifica el token, muestra spinner de carga
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // Si no está autenticado, redirige a login
  if (!isAuthenticated) return <Navigate to="/login" />;

  // Si está autenticado pero no es admin, lo redirige al home
  if (!isAdmin) return <Navigate to="/home" />;

  // Si es admin, permite el acceso a las rutas hijas
  return <Outlet />;
};

export default AdminRoute;
