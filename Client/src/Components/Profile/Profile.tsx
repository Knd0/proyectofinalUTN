import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../Loader/loader";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

interface UserProfile {
  descripcion: string;
  nacionalidad: string;
  dni: string;
  imagen: string;
}

interface User {
  nombre: string;
  email: string;
  perfil: UserProfile;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 600, once: true });

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        setErrorMsg(null);

        const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener datos de usuario");

        const data = await res.json();
        setUser(data.user);
        setFormData(data.user);
      } catch (error) {
        setErrorMsg("No se pudieron cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle cambios de inputs, incluyendo campos anidados en perfil
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (!formData) return;

    // Campos anidados en perfil tienen nombre con formato "perfil.campo"
    if (name.startsWith("perfil.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        perfil: {
          ...formData.perfil,
          [key]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setSaving(true);
    setErrorMsg(null);

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Error al actualizar perfil");

      const updatedData = await res.json();
      setUser(updatedData.user);
      setFormData(updatedData.user);
      setEditMode(false);
    } catch (error) {
      setErrorMsg("Error al guardar los cambios. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-xl">
        <Loader />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="text-center mt-10 text-red-600 font-semibold">
        {errorMsg}
      </div>
    );
  }

  if (!user || !formData) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div
        className="max-w-2xl mx-auto p-6 bg-gray-300 rounded-xl shadow-md mt-10"
        data-aos="fade-up"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
          <button
            onClick={() => {
              if (editMode) {
                setFormData(user); // reset formData si cancela
              }
              setEditMode(!editMode);
              setErrorMsg(null);
            }}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition"
            aria-label={editMode ? "Cancelar edición" : "Editar perfil"}
          >
            {editMode ? "Cancelar" : "Editar"}
          </button>
        </div>

        <div className="flex flex-col items-center gap-4">
          <img
            src={formData.perfil.imagen || "/default-avatar.png"}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-yellow-500 shadow"
          />
          {editMode && (
            <input
              type="text"
              name="perfil.imagen"
              value={formData.perfil.imagen}
              onChange={handleChange}
              placeholder="URL de la imagen"
              className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
            />
          )}
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label htmlFor="nombre" className="font-semibold text-gray-600">
              Nombre
            </label>
            {editMode ? (
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Nombre"
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
            <label htmlFor="descripcion" className="font-semibold text-gray-600">
              Descripción
            </label>
            {editMode ? (
              <textarea
                id="descripcion"
                name="perfil.descripcion"
                value={formData.perfil.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                className="textarea textarea-bordered w-full px-4 py-2 rounded-md border border-gray-300"
                rows={3}
              />
            ) : (
              <p>{user.perfil.descripcion || "Sin descripción"}</p>
            )}
          </div>

          <div>
            <label htmlFor="nacionalidad" className="font-semibold text-gray-600">
              Nacionalidad
            </label>
            {editMode ? (
              <input
                id="nacionalidad"
                type="text"
                name="perfil.nacionalidad"
                value={formData.perfil.nacionalidad}
                onChange={handleChange}
                placeholder="Nacionalidad"
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
              />
            ) : (
              <p>{user.perfil.nacionalidad || "No especificado"}</p>
            )}
          </div>

          <div>
            <label htmlFor="dni" className="font-semibold text-gray-600">
              DNI
            </label>
            {editMode ? (
              <input
                id="dni"
                type="text"
                name="perfil.dni"
                value={formData.perfil.dni}
                onChange={handleChange}
                placeholder="DNI"
                className="input input-bordered w-full px-4 py-2 rounded-md border border-gray-300"
              />
            ) : (
              <p>{user.perfil.dni || "No especificado"}</p>
            )}
          </div>

          {editMode && (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
              aria-busy={saving}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Profile;
