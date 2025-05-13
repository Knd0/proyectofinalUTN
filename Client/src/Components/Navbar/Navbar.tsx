// Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface NavbarProps {
  userInfo: any; // Información del usuario que se pasará como prop
}

const Navbar: React.FC<NavbarProps> = ({ userInfo }) => {
  return (
    <header
      className="w-full max-w-6xl mx-auto px-6 py-8 flex justify-between items-center fade-in"
      data-aos="fade-down"
    >
      <div className="flex items-center gap-4">
        <img
          src={userInfo.perfil.imagen}
          alt="User Avatar"
          className="rounded-full w-12 h-12"
        />
        <h1 className="text-2xl font-bold">{userInfo.nombre}</h1>
      </div>
      <Link to="/profile" className="text-blue-500 hover:underline">
        Mi Perfil
      </Link>
    </header>
  );
};

export default Navbar;
