// Punto de entrada del sistema de rutas de la aplicación frontend (React)
import React from "react";
import { Routes, Route } from "react-router-dom";

// Páginas y componentes principales del sistema
import Landing from "./Pages/Landing";                          // Página de bienvenida
import Login from "./Components/Login/Login";                   // Formulario de inicio de sesión
import Register from "./Components/Login/Register";             // Formulario de registro
import Home from "./Pages/Home";                                // Página principal tras iniciar sesión
import PrivateRoute from "./Pages/PrivateRoute";                // Protege rutas que requieren autenticación
import LoadBalance from "./Components/LoadBalance/LoadBalance"; // Página para cargar saldo
import Profile from "./Components/Profile/Profile";             // Perfil del usuario
import Success from "./Components/LoadBalance/Success";         // Página de éxito al cargar saldo
import Fail from "./Components/LoadBalance/Fail";               // Página de fallo en carga de saldo
import Transaction from "./Components/Transaction/Transaction"; // Historial de transacciones
import FakeCheckout from "./Components/LoadBalance/FakeCheckout";// Simulación de checkout
import Exchange from "./Components/Exchange/Exchange";          // Página para intercambios de monedas
import Dashboard from "Pages/Dashboard";                        // Panel de administración
import AdminRoute from "Pages/AdminRoute";                      // Ruta protegida para admins
import ConfirmAccount from "./Pages/ConfirmAccount";            // Confirmación de cuenta vía token
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword"; // Solicitud de reseteo de contraseña
import ResetPassword from "./Components/ResetPassword/ResetPassword";   // Página para crear nueva contraseña

// Componente principal que define todas las rutas de la aplicación
const App: React.FC = () => {
  // Lógica básica para verificar si el usuario está autenticado
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm/:token" element={<ConfirmAccount />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Rutas protegidas por autenticación */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/loadbalance" element={<LoadBalance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/fake-checkout" element={<FakeCheckout />} />
        <Route path="/exchange" element={<Exchange />} />

        {/* Rutas protegidas exclusivas para administradores */}
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
