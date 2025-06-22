// Importación de dependencias necesarias
import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Navbar/Navbar";

// Lista de monedas disponibles para seleccionar
const currencies = ["ARS", "USD", "EUR", "USDT", "BTC", "ETH"];

// Componente principal para cargar saldo
const LoadBalance: React.FC = () => {
  // Estados locales para el monto y la moneda
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("ARS");

  // Maneja el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validación: no se permite cargar montos menores o iguales a 0
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    // Guarda los datos temporalmente en localStorage
    localStorage.setItem("fake_amount", amount.toString());
    localStorage.setItem("fake_currency", currency);

    // Muestra mensaje y redirige al checkout simulado
    toast.info("Redirigiendo a la simulación de pago...", { autoClose: 1500 });
    setTimeout(() => (window.location.href = "/fake-checkout"), 1500);
  };

  return (
    <>
      {/* Navbar superior */}
      <Navbar />

      {/* Fondo y contenedor principal */}
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
          bgcolor: "rgba(0,0,0,0.7)",
          backgroundBlendMode: "darken",
        }}
      >
        <Container maxWidth="xs">
          {/* Tarjeta con el formulario */}
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
            {/* Título */}
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "white" }}>
              Cargar Saldo
            </Typography>

            {/* Formulario de carga */}
            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              {/* Input de monto */}
              <TextField
                label="Monto"
                type="number"
                fullWidth
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                inputProps={{ min: 0.01, step: 0.01 }}
                required
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

              {/* Selector de moneda */}
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                fullWidth
                required
                sx={{
                  mb: 3,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                }}
              >
                {/* Lista de opciones */}
                {currencies.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>

              {/* Botón de envío */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  backgroundColor: "#3b82f6",
                  "&:hover": { backgroundColor: "#2563eb" },
                  mb: 1,
                }}
              >
                Cargar saldo
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Contenedor de notificaciones */}
      <ToastContainer />
    </>
  );
};

export default LoadBalance;
