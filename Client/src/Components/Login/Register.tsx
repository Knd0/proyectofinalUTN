import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";

interface Country {
  name: { official: string };
}

const Register = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [nacionalidad, setNacionalidad] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountries() {
      setCountriesLoading(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name"
        );
        if (!res.ok) throw new Error("Error fetching countries");
        const data: Country[] = await res.json();
        data.sort((a, b) => a.name.official.localeCompare(b.name.official));
        setCountries(data);
      } catch {
        setError("No se pudo cargar la lista de países.");
      } finally {
        setCountriesLoading(false);
      }
    }
    fetchCountries();
  }, []);

  const sendConfirmationEmail = async (userEmail: string) => {
    try {
      const res = await fetch(
        "https://proyectofinalutn-production.up.railway.app/email/send-confirmation",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail }),
        }
      );
      if (!res.ok) {
        console.error("Error enviando email de confirmación");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            dni,
            nacionalidad,
            nombre: name,
          }),
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        await sendConfirmationEmail(email);
        navigate("/login", { replace: true });
      } else {
        setError(data.error || "Error en el registro. Revisa tus datos.");
      }
    } catch {
      setError("Error de conexión. Intenta nuevamente.");
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
        bgcolor: "background.default",
        backgroundImage:
          "url('https://source.unsplash.com/random?finance-signup&orientation=landscape')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          <PersonAddAltOutlinedIcon
            sx={{ fontSize: 48, color: "secondary.main", mb: 2 }}
            aria-label="Icono de registro"
          />
          <Typography
            component="h1"
            variant="h4"
            sx={{ mb: 3, fontWeight: "bold", color: "text.primary" }}
          >
            Registrarse
          </Typography>

          <Box
            component="form"
            onSubmit={handleRegister}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              label="Nombre Completo"
              required
              fullWidth
              margin="normal"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Correo Electrónico"
              type="email"
              required
              fullWidth
              margin="normal"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña"
              type="password"
              required
              fullWidth
              margin="normal"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              label="DNI"
              type="number"
              required
              fullWidth
              margin="normal"
              inputProps={{ pattern: "[0-9]*" }}
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth margin="normal" sx={{ mb: 3 }}>
              <InputLabel id="nacionalidad-label">Nacionalidad</InputLabel>
              <Select
                labelId="nacionalidad-label"
                id="nacionalidad"
                value={nacionalidad}
                onChange={(e) => setNacionalidad(e.target.value)}
                label="Nacionalidad"
                disabled={countriesLoading}
              >
                {!countriesLoading && (
                  <MenuItem value="" disabled>
                    Selecciona tu nacionalidad
                  </MenuItem>
                )}

                {countriesLoading ? (
                  <MenuItem disabled>Cargando países...</MenuItem>
                ) : (
                  countries.map((country, idx) => (
                    <MenuItem key={idx} value={country.name.official}>
                      {country.name.official}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            {error && (
              <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderRadius: 2,
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Registrarse"
              )}
            </Button>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{" "}
                <Link
                  component={RouterLink}
                  to="/login"
                  variant="body2"
                  color="primary.main"
                  sx={{ fontWeight: "bold" }}
                >
                  Inicia sesión aquí
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
