// src/context/UserContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";

export interface Balance {
  ARS: number;
  USD: number;
  EUR: number;
  BTC: number;
  ETH: number;
  USDT: number;
}

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

interface UserContextType {
  userInfo: User | null;
  setUserInfo: (user: User | null) => void;
  balance: Balance;
  setBalance: (balance: Balance) => void;
  fetchUserData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [balance, setBalance] = useState<Balance>({
    ARS: 0,
    USD: 0,
    EUR: 0,
    BTC: 0,
    ETH: 0,
    USDT: 0,
  });

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Error al obtener datos del usuario");

      const data = await res.json();
      setUserInfo(data.user);
      setBalance(data.user.balance || {});
    } catch (err) {
      console.error("Error al cargar userInfo:", err);
    }
  };

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
