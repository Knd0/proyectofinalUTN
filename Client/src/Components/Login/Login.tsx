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
  CircularProgress, // For loading state
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined"; // Example icon for login form

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Use null for no error
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Set loading to true

    try {
      const response = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include", // Ensure cookies are sent
        }
      );

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        // Ensure data.token exists before setting
        if (data.token) {
          localStorage.setItem("token", data.token);
          navigate("/home", { replace: true });
        } else {
          // Handle case where token is missing but response is ok
          setError("Login exitoso pero no se recibió el token de autenticación.");
        }
      } else {
        setError(data.error || "Error al iniciar sesión. Por favor, verifica tus credenciales.");
        console.error("Login Error:", data.error);
      }
    } catch (err) {
      console.error("Connection Error:", err);
      setError("Error de conexión. No se pudo conectar con el servidor.");
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default", // Use theme background color
        backgroundImage: "url('https://source.unsplash.com/random?money-transfer&orientation=landscape')", // Example background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={10} // Stronger shadow for the form
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3, // Rounded corners
            bgcolor: "background.paper", // Use theme paper background color
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)', // More pronounced shadow
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} /> {/* Icon at the top */}
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: "bold", color: 'text.primary' }}>
            Iniciar Sesión
          </Typography>
          <Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1, width: "100%" }}>
            <TextField
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
              variant="outlined" // Consistent outlined style
              sx={{ mb: 2 }} // Margin bottom
            />
            <TextField
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
              variant="outlined" // Consistent outlined style
              sx={{ mb: 2 }} // Margin bottom
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
                width: "100%",
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={
                  <Typography variant="body2" color="text.secondary">
                    Recordarme
                  </Typography>
                }
              />
              <Link href="#" variant="body2" color="primary.main" sx={{ fontWeight: 'medium' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {error}
              </Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
              disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Iniciar Sesión"}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{" "}
                <Link href="/register" variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
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