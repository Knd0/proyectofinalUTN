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

const currencies = ["ARS", "USD", "EUR", "USDT", "BTC", "ETH"];

const LoadBalance: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("ARS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      toast.error("El monto debe ser mayor a 0");
      return;
    }

    localStorage.setItem("fake_amount", amount.toString());
    localStorage.setItem("fake_currency", currency);

    toast.info("Redirigiendo a la simulación de pago...", { autoClose: 1500 });
    setTimeout(() => (window.location.href = "/fake-checkout"), 1500);
  };

  return (
    <>
      <Navbar />
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
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", color: "white" }}>
              Cargar Saldo
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
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
                {currencies.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>

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
      <ToastContainer />
    </>
  );
};

export default LoadBalance;
