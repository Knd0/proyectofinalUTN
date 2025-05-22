// Navbar.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface UserInfo {
  nombre: string;
  perfil: {
    imagen: string;
  };
}

const Navbar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("No se pudo obtener el usuario");
        }

        const data = await response.json();
        setUserInfo(data.user);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!userInfo) {
    return null; // o un loader si querés
  }

  return (
    <header
      className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center fade-in"
      data-aos="fade-down"
    >
      <div className="flex items-center gap-4">
        {/* Botón Home a la izquierda */}
        <button
          onClick={() => navigate("/home")}
          className="text-blue-600 hover:text-blue-800 font-semibold"
        >
          Inicio
        </button>

        <img
          src={userInfo.perfil.imagen}
          alt="User Avatar"
          className="rounded-full w-12 h-12"
        />
        <h1 className="text-2xl font-bold">{userInfo.nombre}</h1>
      </div>
      <div className="flex items-center gap-4">
        <Link to="/profile" className="text-blue-500 hover:underline">
          Mi Perfil
        </Link>
        <button
          onClick={handleLogout}
          className="text-red-500 hover:underline"
        >
          Cerrar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;
