import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Link,
  Alert,
  CircularProgress, // For loading state
  FormControl, // For select input
  InputLabel, // For select input label
  Select, // For select input
  MenuItem, // For select options
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined"; // Example icon for register form

interface Country {
  name: { official: string };
}

const Register = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [dni, setDni] = useState("");
  const [nacionalidad, setNacionalidad] = useState(""); // Renamed for clarity, was 'nacionalidad'
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // New loading state for registration
  const [countriesLoading, setCountriesLoading] = useState(true); // New loading state for countries
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountries = async () => {
      setCountriesLoading(true);
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        if (!response.ok) {
          throw new Error("Failed to fetch countries.");
        }
        const data: Country[] = await response.json();
        const sorted = data.sort((a: Country, b: Country) =>
          a.name.official.localeCompare(b.name.official)
        );
        setCountries(sorted);
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Error al cargar la lista de países.");
      } finally {
        setCountriesLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const sendConfirmationEmail = async (userEmail: string) => { // Renamed param to avoid shadowing
    try {
      const response = await fetch("https://proyectofinalutn-production.up.railway.app/email/send-confirmation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!response.ok) {
        console.error("Failed to send confirmation email:", await response.json());
      }
    } catch (err) {
      console.error("Error sending confirmation email:", err);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    setLoading(true); // Set loading to true

    try {
      const response = await fetch("https://proyectofinalutn-production.up.railway.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          dni,
          nacionalidad, // Use the state variable
          nombre: name,
        }),
        credentials: "include",
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        await sendConfirmationEmail(email); // Pass the email state
        navigate("/login", { replace: true });
      } else {
        setError(data.error || "Error de registro. Por favor, verifica tus datos.");
        console.error("Registration Error:", data.error);
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
        bgcolor: "background.default",
        backgroundImage: "url('https://source.unsplash.com/random?finance-signup&orientation=landscape')", // Different background image
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
            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
          }}
        >
          <PersonAddAltOutlinedIcon sx={{ fontSize: 48, color: "secondary.main", mb: 2 }} />
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: "bold", color: 'text.primary' }}>
            Registrarse
          </Typography>
          <Box component="form" onSubmit={handleRegister} noValidate sx={{ mt: 1, width: "100%" }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre Completo"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Correo Electrónico"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Contraseña"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="dni"
              label="DNI"
              name="dni"
              type="number" // Set type to number for DNI
              inputProps={{ pattern: "[0-9]*" }} // Restrict to numbers
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
                label="Nacionalidad"
                onChange={(e) => setNacionalidad(e.target.value as string)}
                disabled={countriesLoading} // Disable until countries are loaded
              >
                {countriesLoading ? (
                  <MenuItem disabled>Cargando países...</MenuItem>
                ) : (
                  <>
                    <MenuItem value="" disabled>
                      Selecciona tu nacionalidad
                    </MenuItem>
                    {countries.map((c, i) => (
                      <MenuItem key={i} value={c.name.official}>
                        {c.name.official}
                      </MenuItem>
                    ))}
                  </>
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
              color="secondary" // Changed color for distinction from login
              sx={{ mt: 3, mb: 2, py: 1.5, fontSize: '1.1rem', fontWeight: 'bold', borderRadius: 2 }}
              disabled={loading} // Disable button when loading
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Registrarse"}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/login" variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
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