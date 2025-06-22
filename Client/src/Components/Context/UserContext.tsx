// src/context/UserContext.tsx

import React, { createContext, useState, useEffect, useContext } from "react";

// Define la estructura esperada para los balances de distintas monedas
export interface Balance {
  ARS: number;
  USD: number;
  EUR: number;
  BTC: number;
  ETH: number;
  USDT: number;
}

// Define el tipo de datos que tendrá un usuario
export interface User {
  nombre: string;
  email: string;
  cvu: string;
  balance: Balance;
  isconfirmed: boolean;
  perfil?: {
    descripcion: string;
    nacionalidad: string;
    dni: string;
    imagen: string;
  };
}

// Define el tipo de datos que manejará el contexto
interface UserContextType {
  userInfo: User | null;                            // Información del usuario logueado
  setUserInfo: (user: User | null) => void;         // Setter para actualizar la info del usuario
  balance: Balance;                                 // Balance actual del usuario
  setBalance: (balance: Balance) => void;           // Setter para actualizar el balance
  fetchUserData: () => Promise<void>;               // Función para traer los datos del usuario desde la API
}

// Crea el contexto con un valor inicial undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Hook personalizado para consumir el contexto de usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

// Proveedor del contexto que rodeará la app
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Estado local para guardar la info del usuario
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Estado para el balance (por defecto todo en cero)
  const [balance, setBalance] = useState<Balance>({
    ARS: 0,
    USD: 0,
    EUR: 0,
    BTC: 0,
    ETH: 0,
    USDT: 0,
  });

  // Función para traer los datos del usuario autenticado desde la API
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener datos del usuario");

      const data = await res.json();
      setUserInfo(data.user);                 // Guarda info general
      setBalance(data.user.balance || {});    // Guarda los balances
    } catch (err) {
      console.error("Error al cargar userInfo:", err);
    }
  };

  // Ejecuta la carga de datos apenas se monta el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider
      value={{ userInfo, setUserInfo, balance, setBalance, fetchUserData }}
    >
      {children}
    </UserContext.Provider>
  );
};
