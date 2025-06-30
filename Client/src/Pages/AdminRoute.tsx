// src/Pages/AdminRoute.tsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

const AdminRoute: React.FC = () => {
  
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  //controla si el usuario es admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    // Obtiene el token del localStorage
    // Si no hay token, el usuario no está autenticado
    if (!token) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    // Realiza una solicitud a tu API para verificar el token
    fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      //Si la respuesta no es ok, lanza un error
      // Si la respuesta es ok, convierte la respuesta a JSON
      .then((res) => {
        if (!res.ok) throw new Error("No autorizado");
        return res.json();
      })
      // Si la respuesta es exitosa, actualiza el estado de autenticación y admin
      .then((data) => {
        setIsAuthenticated(true);
        setIsAdmin(data.user.admin === true);
      })
      //Si falla alguno de los pasos anteriores, actualiza el estado de autenticación y admin
      // a false y finaliza el loading
      .catch(() => {
        setIsAuthenticated(false);
        setIsAdmin(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
  
  if (loading) {
    // Muestra un spinner mientras se verifica la autenticación
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }
  // Si no está autenticado o no es admin, redirige a las rutas correspondientes
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/home" />;
  return <Outlet />;
};

export default AdminRoute;
