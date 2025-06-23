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
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "Components/Navbar/Navbar";

type TransactionProps = {
  userInfo?: { nombre?: string };
};

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Transaction: React.FC<TransactionProps> = ({ userInfo }) => {
  const [toCvu, setToCvu] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!toCvu.trim()) {
      setMessage({ text: "El CVU destino es obligatorio", type: "error" });
      return false;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: "El monto debe ser un número positivo", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toUserCvu: toCvu.trim(),
          amount: parseFloat(amount),
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Error inesperado", type: "error" });
      } else {
        setMessage({ text: "✅ ¡Transacción realizada con éxito!", type: "success" });
        setToCvu("");
        setAmount("");
      }
    } catch {
      setMessage({ text: "Error al conectar con el servidor", type: "error" });
    } finally {
      setLoading(false);
    }
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
          backgroundImage: "url('https://source.unsplash.com/featured/?money,banking')",
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
              Transferir Saldo
            </Typography>

            {userInfo?.nombre && (
              <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Usuario: <strong>{userInfo.nombre}</strong>
              </Typography>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
              <TextField
                label="CVU destino"
                variant="outlined"
                fullWidth
                value={toCvu}
                onChange={(e) => setToCvu(e.target.value)}
                disabled={loading}
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

              <TextField
                label="Monto"
                type="number"
                fullWidth
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                required
                inputProps={{ min: 0.01, step: 0.01 }}
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
                disabled={loading}
                sx={{
                  mb: 3,
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                }}
              >
                {currencies.map((cur) => (
                  <MenuItem key={cur} value={cur}>
                    {cur}
                  </MenuItem>
                ))}
              </Select>

              {message && (
                <Alert severity={message.type} sx={{ mb: 2 }}>
                  {message.text}
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
                  mb: 2,
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
              </Button>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/home")}
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: "bold",
                  borderRadius: 2,
                  color: "white",
                  borderColor: "white",
                  "&:hover": {
                    backgroundColor: "rgba(255,255,255,0.1)",
                    borderColor: "white",
                  },
                }}
              >
                Volver al Inicio
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Transaction;
