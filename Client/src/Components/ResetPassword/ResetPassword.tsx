import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import LockResetIcon from "@mui/icons-material/LockReset";

// Componente para restablecer la contraseña a través de un token enviado por email
const ResetPassword = () => {
  // Obtiene el token desde la URL
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  // Estados para los campos y el feedback del usuario
  const [password, setPassword] = useState(""); // Nueva contraseña
  const [confirmPassword, setConfirmPassword] = useState(""); // Confirmación
  const [loading, setLoading] = useState(false); // Spinner mientras se procesa
  const [error, setError] = useState<string | null>(null); // Mensaje de error
  const [success, setSuccess] = useState(false); // Estado de éxito

  // Función que maneja el envío del formulario
  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: las contraseñas deben coincidir
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Llamado al backend para restablecer la contraseña usando el token
      const res = await fetch(
        `https://proyectofinalutn-production.up.railway.app/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nuevaPassword: password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        // Redirige automáticamente al login después de 3 segundos
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setError(data.error || "Error al restablecer la contraseña.");
      }
    } catch {
      setError("Error de conexión con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: "url('https://source.unsplash.com/featured/?lock,password')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0,0,0,0.7)",
        backgroundBlendMode: "darken", // oscurece la imagen de fondo para mejor legibilidad
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
            bgcolor: "rgba(17, 24, 39, 0.85)",
            color: "white",
          }}
        >
          <LockResetIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "white" }}
          >
            Restablecer Contraseña
          </Typography>

          {/* Formulario de restablecimiento */}
          <Box component="form" onSubmit={handleReset} sx={{ width: "100%" }}>
            {/* Campo para la nueva contraseña */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Nueva Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                mb: 2,
                input: { color: "white" },
                label: { color: "#9ca3af" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#3b82f6" },
                  "&:hover fieldset": { borderColor: "#60a5fa" },
                  "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
                },
              }}
            />

            {/* Campo para confirmar la nueva contraseña */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Confirmar Contraseña"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

            {/* Mensaje de error en caso de fallo */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {/* Mensaje de éxito si se reseteó correctamente */}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Contraseña restablecida con éxito. Redirigiendo al login...
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Restablecer"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;
