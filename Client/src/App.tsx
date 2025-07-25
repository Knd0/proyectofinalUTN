import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Components/Login/Login"; // Asegúrate de importar el componente Login
import Register from "./Components/Login/Register";
import Home from "./Pages/Home"; // Asegúrate de tener este componente Home
import PrivateRoute from "./Pages/PrivateRoute"; // Componente para proteger las rutas privadas
import LoadBalance from "./Components/LoadBalance/LoadBalance";
import Profile from "./Components/Profile/Profile";
import Success from "./Components/LoadBalance/Success";
import Fail from "./Components/LoadBalance/Fail";
import Transaction from "./Components/Transaction/Transaction";
import FakeCheckout from "./Components/LoadBalance/FakeCheckout";
import Exchange from "./Components/Exchange/Exchange";
import Dashboard from "Pages/Dashboard";
import AdminRoute from "Pages/AdminRoute";
import ConfirmAccount from "./Pages/ConfirmAccount";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem("token"); // o tu lógica real

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/confirm/:token" element={<ConfirmAccount />} /> 
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/loadbalance" element={<LoadBalance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/fake-checkout" element={<FakeCheckout />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
