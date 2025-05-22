// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Components/Login/Login';  // Asegúrate de importar el componente Login
import Register from './Components/Login/Register';
import Home from './Pages/Home';  // Asegúrate de tener este componente Home
import PrivateRoute from './Pages/PrivateRoute';  // Componente para proteger las rutas privadas
import LoadBalance from './Components/LoadBalance/LoadBalance';
import Profile from './Components/Profile/Profile';
import Success from './Components/LoadBalance/Success';
import Fail from './Components/LoadBalance/Fail';
import Transaction from "./Components/Transaction/Transaction";
import FakeCheckout from './Components/LoadBalance/FakeCheckout';



const App: React.FC = () => {
  const isAuthenticated = true;  
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path="/home" element={<Home />} />
        <Route path="/loadbalance" element={<LoadBalance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/success" element={<Success />} />
        <Route path="/fail" element={<Fail />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/fake-checkout" element={<FakeCheckout />} />
      </Route>
    </Routes>
  );
};

export default App;
