// Importación de hooks, componentes de MUI y utilidades
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  CssBaseline,
  Grid,
  Link,
  Paper,
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Componente de registro
const Register = () => {
  const navigate = useNavigate(); // para redirección post-registro

  // Estados de los campos del formulario
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");

  // Manejo del envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple de campos vacíos
    if (!nombre || !email || !password || !dni || !nacionalidad) {
      toast.error("Por favor completá todos los campos");
      return;
    }

    // Envío de datos al backend
    try {
      await axios.post("https://proyectofinalutn-production.up.railway.app/auth/register", {
        nombre,
        email,
        password,
        dni,
        nacionalidad,
      });

      toast.success("✅ Registro exitoso");
      setTimeout(() => navigate("/login"), 1500); // redirige tras éxito
    } catch (error) {
      console.error(error);
      toast.error("❌ Error al registrar");
    }
  };

  // Renderizado del formulario
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://source.unsplash.com/featured/?finance,bank')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0, 0, 0, 0.7)", // superposición oscura
        backgroundBlendMode: "darken",
      }}
    >
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Paper
          elevation={12}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            backdropFilter: "blur(8px)",
            bgcolor: "rgba(17, 24, 39, 0.85)", // fondo oscuro semitransparente
            color: "white",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "success.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" fontWeight="bold" mb={2}>
            Crear cuenta
          </Typography>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              sx={muiInputStyle}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={muiInputStyle}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={muiInputStyle}
            />
            <TextField
              margin="normal"
              fullWidth
              label="DNI"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              sx={muiInputStyle}
            />

            {/* Selector de nacionalidad */}
            <FormControl fullWidth sx={muiInputStyle}>
              <InputLabel sx={{ color: "#9ca3af" }}>Nacionalidad</InputLabel>
              <Select
                value={nacionalidad}
                label="Nacionalidad"
                onChange={(e) => setNacionalidad(e.target.value)}
                sx={{
                  color: "white",
                  ".MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                }}
              >
                <MenuItem value="Argentina">Argentina</MenuItem>
                <MenuItem value="Uruguay">Uruguay</MenuItem>
                <MenuItem value="Chile">Chile</MenuItem>
                <MenuItem value="Paraguay">Paraguay</MenuItem>
              </Select>
            </FormControl>

            {/* Botón de registro */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2, py: 1.5, fontWeight: "bold", fontSize: "1rem" }}
            >
              Registrarse
            </Button>

            {/* Link a login */}
            <Grid container justifyContent="flex-end">
              <Grid>
                <Link href="/login" variant="body2" color="secondary">
                  ¿Ya tenés cuenta? Iniciá sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
      <ToastContainer /> {/* Contenedor de los toasts */}
    </Box>
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

export default Register;
