import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../Loader/loader";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
  nombre: string;
  email: string;
  perfil: {
    descripcion: string;
    nacionalidad: string;
    dni: string;
    imagen: string;
  };
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init();
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirige al login si no hay token
    }

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirige al login si no hay token
          return;
        }

        const response = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en los headers
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los datos del usuario");
        }

        const data = await response.json();
        console.log(data);
        console.log(data.user);
        console.log(data.user.balance);
        setUser(data.user);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFormData(data.user);
      } else {
        console.error("❌ Error al recargar datos del perfil");
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser.user);
        await fetchUserData(); // 👈 recarga datos actualizados
        setEditMode(false);
      } else {
        console.error("❌ Error al actualizar perfil");
      }
    } catch (error) {
      console.error("❌ Error en la petición:", error);
    }
  };

  if (!user || Object.keys(user).length === 0) {
    return (
      <div className="text-center mt-10 text-xl">
        <Loader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-300 rounded-xl shadow-md mt-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <button
          onClick={() => setEditMode(!editMode)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
        >
          {editMode ? "Cancelar" : "Editar"}
        </button>
      </div>

      <div className="flex flex-col items-center gap-4">
        <img
          src={user.perfil?.imagen}
          alt="Avatar"
          className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow"
        />
        {editMode && (
          <input
            type="text"
            name="imagen"
            value={formData.perfil?.imagen}
            onChange={handleChange}
            placeholder={user.perfil?.imagen}
            className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
          />
        )}
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label className="font-semibold text-gray-600">Nombre</label>
          {editMode ? (
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder={user.nombre}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
            />
          ) : (
            <p>{user.nombre}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-600">Email</label>
          <p>{user.email}</p>
        </div>

        <div>
          <label className="font-semibold text-gray-600">Descripción</label>
          {editMode ? (
            <textarea
              name="descripcion"
              value={formData.perfil?.descripcion}
              onChange={handleChange}
              placeholder={user.perfil?.descripcion}
              className="textarea textarea-bordered w-full px-4 py-2 rounded-md border border-gray-300"
            />
          ) : (
            <p>{user.perfil?.descripcion || "Sin descripción"}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-600">Nacionalidad</label>
          {editMode ? (
            <input
              type="text"
              name="nacionalidad"
              value={formData.perfil?.nacionalidad}
              onChange={handleChange}
              placeholder={user.perfil?.nacionalidad}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
            />
          ) : (
            <p>{user.perfil?.nacionalidad || "No especificado"}</p>
          )}
        </div>

        <div>
          <label className="font-semibold text-gray-600">DNI</label>
          {editMode ? (
            <input
              type="text"
              name="dni"
              value={formData.perfil?.dni}
              onChange={handleChange}
              placeholder={user.perfil?.dni}
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
            />
          ) : (
            <p>{user.perfil?.dni || "No especificado"}</p>
          )}
        </div>

        {editMode && (
          <button
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Guardar Cambios
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;
