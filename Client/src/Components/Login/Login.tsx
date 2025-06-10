import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/home", { replace: true });
      } else {
        setError(data.error || "Error al iniciar sesión. Verifica tus credenciales.");
        console.error("Login Error:", data.error);
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Error de conexión. No se pudo conectar con el servidor.");
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
        backgroundImage: "url('https://source.unsplash.com/featured/?digital-wallet')",
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
          <LockOutlinedIcon sx={{ fontSize: 48, color: "#3b82f6", mb: 2 }} />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "white" }}
          >
            Iniciar Sesión
          </Typography>
          <Box
            component="form"
            onSubmit={handleLogin}
            noValidate
            sx={{ width: "100%" }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="current-password"
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" sx={{ color: "#3b82f6" }} />}
                label={
                  <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                    Recordarme
                  </Typography>
                }
              />
              <Link href="#" variant="body2" sx={{ color: "#3b82f6" }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2" sx={{ color: "#d1d5db" }}>
                ¿No tienes una cuenta?{" "}
                <Link href="/register" sx={{ color: "#3b82f6", fontWeight: "bold" }}>
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
