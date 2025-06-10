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

const ResetPassword = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
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
        // Opcional: redirigir al login luego de 3 segundos
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
        backgroundImage:
          "url('https://source.unsplash.com/featured/?lock,password')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        bgcolor: "rgba(0,0,0,0.7)",
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

          <Box component="form" onSubmit={handleReset} sx={{ width: "100%" }}>
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

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Contraseña restablecida con éxito. Redirigiendo al login...
              </Alert>
            )}

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
