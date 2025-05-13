// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Landing from './Pages/Landing';
import Login from './Components/Login/Login';  // Asegúrate de importar el componente Login
import Register from './Components/Login/Register';
import Home from './Pages/Home';  // Asegúrate de tener este componente Home
import PrivateRoute from './Pages/PrivateRoute';  // Componente para proteger las rutas privadas
import LoadBalance from './Components/LoadBalance/LoadBalance';



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
      </Route>
    </Routes>
  );
};

export default App;
