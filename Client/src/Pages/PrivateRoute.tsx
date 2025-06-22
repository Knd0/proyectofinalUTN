// Este componente se utiliza para proteger rutas que requieren autenticación
// y redirige al usuario a la página de inicio de sesión si no está autenticado
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Props esperadas: un booleano que indica si el usuario está autenticado
interface PrivateRouteProps {
  isAuthenticated: boolean;
}

// Componente funcional que decide si renderiza la ruta protegida o redirige al login
const PrivateRoute: React.FC<PrivateRouteProps> = ({ isAuthenticated }) => {
  // Si no está autenticado, redirige automáticamente a la página de login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderiza el contenido anidado (Outlet)
  return <Outlet />;
};

export default PrivateRoute;
