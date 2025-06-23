// Importación de React y hooks necesarios
import React, { useState } from "react";

// Importación de componentes de Material UI
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";

// Icono de reseteo de contraseña
import LockResetIcon from "@mui/icons-material/LockReset";

// Componente funcional ForgotPassword
const ForgotPassword = () => {
  // Estado para manejar el email ingresado
  const [email, setEmail] = useState("");

  // Estado para saber si el proceso fue exitoso
  const [success, setSuccess] = useState(false);

  // Estado para mostrar errores al usuario
  const [error, setError] = useState<string | null>(null);

  // Estado para mostrar el loader mientras se procesa la solicitud
  const [loading, setLoading] = useState(false);

  // Manejador del formulario
  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevenir comportamiento por defecto del form
    setLoading(true);
    setError(null);

    try {
      // Solicitud POST al endpoint del backend para solicitar recuperación
      const response = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      // Interpretar respuesta
      const data = await response.json();

      if (response.ok) {
        // Si es exitosa, mostramos el mensaje de éxito
        setSuccess(true);
      } else {
        // Si hubo error, lo mostramos al usuario
        setError(data.error || "No se pudo enviar el correo.");
      }
    } catch (err) {
      // Error de red o servidor
      setError("Error al conectar con el servidor.");
    } finally {
      setLoading(false); // Ocultar loader en todos los casos
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://source.unsplash.com/featured/?password,email')", // Imagen de fondo contextual
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0,0,0,0.7)", // Oscurecimiento
        backgroundBlendMode: "darken",
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={12}
          sx={{
            p: 4,
            borderRadius: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backdropFilter: "blur(8px)",
            bgcolor: "rgba(17, 24, 39, 0.85)", // Fondo semi transparente
            color: "white",
          }}
        >
          {/* Ícono principal */}
          <LockResetIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />

          {/* Título */}
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "white" }}
          >
            Recuperar Contraseña
          </Typography>

          {/* Formulario */}
          <Box component="form" onSubmit={handleForgot} sx={{ width: "100%" }}>
            {/* Campo de correo */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Correo Electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                mb: 3,
                input: { color: "white" },
                label: { color: "#9ca3af" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#3b82f6" },
                  "&:hover fieldset": { borderColor: "#60a5fa" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
              }}
            />

            {/* Mensaje de error si hay */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Mensaje de éxito si el envío fue correcto */}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Te enviamos un enlace de recuperación a tu correo.
              </Alert>
            )}

            {/* Botón de envío */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              {/* Mostrar loader mientras se envía */}
              {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar enlace"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

// Exporta el componente para ser usado en el router
export default ForgotPassword;
