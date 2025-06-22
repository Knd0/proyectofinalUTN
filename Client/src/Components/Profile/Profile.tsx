// Dependencias principales de React y librerías externas
import React, { useEffect, useState } from "react";
import AOS from "aos"; // Animaciones de scroll
import "aos/dist/aos.css";
import Loader from "../Loader/loader"; // Componente personalizado de carga
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar"; // Navbar principal

// Componentes de Material UI
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
  Alert,
} from "@mui/material";

// Interfaces para tipar correctamente el usuario y su perfil
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
  // Estados del componente
  const [user, setUser] = useState<User | null>(null); // Datos del usuario original
  const [editMode, setEditMode] = useState(false); // Modo edición activo
  const [formData, setFormData] = useState<User | null>(null); // Copia editable del usuario
  const [loading, setLoading] = useState(true); // Estado de carga inicial
  const [saving, setSaving] = useState(false); // Indicador de guardado
  const [errorMsg, setErrorMsg] = useState<string | null>(null); // Error general
  const navigate = useNavigate(); // Hook para redireccionar

  // Al montar el componente
  useEffect(() => {
    AOS.init({ duration: 600, once: true }); // Inicializa animaciones

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Si no hay token, redirige
      return;
    }

    // Trae los datos del usuario logueado
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
        setUser(data.user); // Guarda original
        setFormData(data.user); // Copia editable
      } catch (error) {
        setErrorMsg("No se pudieron cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Manejador de cambios en los inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!formData) return;

    if (name.startsWith("perfil.")) {
      // Actualiza campo anidado del perfil
      const key = name.split(".")[1] as keyof UserProfile;
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

  // Envía los datos modificados al backend
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

  // Loader mientras se obtienen los datos
  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Loader />
      </Box>
    );
  }

  // Muestra error general
  if (errorMsg) {
    return (
      <Box textAlign="center" mt={10}>
        <Alert severity="error">{errorMsg}</Alert>
      </Box>
    );
  }

  // Si algo salió mal y no hay datos válidos
  if (!user || !formData || !formData.perfil) return null;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('https://source.unsplash.com/featured/?digital-wallet')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          bgcolor: "rgba(0,0,0,0.7)",
          backgroundBlendMode: "darken",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 3,
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(17, 24, 39, 0.85)",
              color: "white",
            }}
          >
            {/* Título y botón de edición */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h4" fontWeight="bold" color="white">
                Mi Perfil
              </Typography>
              <Button
                variant="text"
                sx={{ color: "#3b82f6", fontWeight: "bold" }}
                onClick={() => {
                  if (editMode) setFormData(user); // Cancela cambios
                  setEditMode(!editMode); // Cambia modo edición
                  setErrorMsg(null);
                }}
              >
                {editMode ? "Cancelar" : "Editar"}
              </Button>
            </Box>

            {/* Avatar e imagen */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                src={formData.perfil.imagen || "/default-avatar.png"}
                alt="Avatar"
                sx={{ width: 100, height: 100, mb: 2 }}
              />
              {editMode && (
                <TextField
                  fullWidth
                  label="URL de la imagen"
                  name="perfil.imagen"
                  value={formData.perfil.imagen}
                  onChange={handleChange}
                  variant="outlined"
                  sx={muiInputStyle}
                  InputLabelProps={{ style: { color: "#9ca3af" } }}
                  InputProps={{
                    style: { color: "white" },
                  }}
                />
              )}
            </Box>

            {/* Campos editables */}
            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              variant="outlined"
              disabled={!editMode}
              sx={muiInputStyle}
              InputLabelProps={{ style: { color: "#9ca3af" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Descripción"
              name="perfil.descripcion"
              value={formData.perfil.descripcion}
              onChange={handleChange}
              variant="outlined"
              disabled={!editMode}
              sx={muiInputStyle}
              InputLabelProps={{ style: { color: "#9ca3af" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              fullWidth
              label="Nacionalidad"
              name="perfil.nacionalidad"
              value={formData.perfil.nacionalidad}
              onChange={handleChange}
              variant="outlined"
              disabled={!editMode}
              sx={muiInputStyle}
              InputLabelProps={{ style: { color: "#9ca3af" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              fullWidth
              label="DNI"
              name="perfil.dni"
              value={formData.perfil.dni}
              onChange={handleChange}
              variant="outlined"
              disabled={!editMode}
              sx={muiInputStyle}
              InputLabelProps={{ style: { color: "#9ca3af" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              fullWidth
              label="Email"
              value={user.email}
              variant="outlined"
              disabled
              sx={muiInputStyle}
              InputLabelProps={{ style: { color: "#9ca3af" } }}
              InputProps={{ style: { color: "white" } }}
            />

            {/* Botón de guardar */}
            {editMode && (
              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontWeight: "bold",
                  backgroundColor: "#3b82f6",
                  "&:hover": { backgroundColor: "#2563eb" },
                }}
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? <CircularProgress size={24} color="inherit" /> : "Guardar Cambios"}
              </Button>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

// Estilos reutilizables para los campos de texto
const muiInputStyle = {
  mb: 2,
  input: { color: "white" },
  label: { color: "#9ca3af" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#3b82f6" },
    "&:hover fieldset": { borderColor: "#60a5fa" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
};

export default Profile;
