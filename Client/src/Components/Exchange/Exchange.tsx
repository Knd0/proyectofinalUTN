import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Navbar from "Components/Navbar/Navbar";

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Exchange: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const fetchBalances = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://proyectofinalutn-production.up.railway.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances(res.data?.user.balance || {});
    } catch (error) {
      console.error("Error al obtener balances:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      return;
    }
    const fetchRate = async () => {
      try {
        const res = await axios.get("https://api.currencyapi.com/v3/latest", {
          params: {
            apikey: "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX",
            base_currency: fromCurrency,
            currencies: toCurrency,
          },
        });
        const rate = res.data?.data?.[toCurrency]?.value;
        setExchangeRate(rate);
      } catch {
        setExchangeRate(null);
      }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedValue(amount * exchangeRate);
    } else {
      setConvertedValue(null);
    }
  }, [amount, exchangeRate]);

  const handleSwap = async () => {
    if (fromCurrency === toCurrency) {
      setMessage("Las monedas deben ser diferentes");
      return;
    }
    if (amount <= 0) {
      setMessage("La cantidad debe ser mayor que cero");
      return;
    }
    if ((balances[fromCurrency] || 0) < amount) {
      setMessage(`Saldo insuficiente en ${fromCurrency}`);
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://proyectofinalutn-production.up.railway.app/exchange/me",
        { fromCurrency, toCurrency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        `✅ Convertiste ${amount} ${fromCurrency} a ${res.data.converted.toFixed(2)} ${toCurrency}. Redirigiendo...`
      );
      setAmount(0);
      setConvertedValue(null);
      await fetchBalances();

      setTimeout(() => navigate("/home"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error al realizar la conversión");
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
          backgroundImage: "url('https://source.unsplash.com/featured/?exchange,crypto')",
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
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(17, 24, 39, 0.85)",
              color: "white",
            }}
          >
            <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
              Convertir Saldo
            </Typography>

            <TextField
              label={`Cantidad (${fromCurrency})`}
              type="number"
              fullWidth
              value={amount || ""}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, step: 0.01 }}
              disabled={loading}
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
              placeholder={`Disponible: ${balances[fromCurrency] ?? 0}`}
            />

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
              <Select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                fullWidth
                disabled={loading}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                }}
              >
                {currencies.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>

              <Select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                fullWidth
                disabled={loading}
                sx={{
                  color: "white",
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "#3b82f6" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#60a5fa" },
                }}
              >
                {currencies.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </Box>

            {exchangeRate !== null && amount > 0 && (
              <Typography
                variant="h6"
                align="center"
                sx={{ mb: 2, fontWeight: "medium", color: "#cbd5e1" }}
              >
                {amount} {fromCurrency} ={" "}
                {convertedValue !== null ? convertedValue.toFixed(2) : "..."} {toCurrency}
              </Typography>
            )}

            <Button
              onClick={handleSwap}
              disabled={loading}
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                fontSize: "1rem",
                fontWeight: "bold",
                borderRadius: 2,
                backgroundColor: "#3b82f6",
                "&:hover": { backgroundColor: "#2563eb" },
              }}
            >
              {loading ? "Convirtiendo..." : "Convertir"}
            </Button>

            {message && (
              <Typography
                sx={{
                  mt: 3,
                  textAlign: "center",
                  fontWeight: "medium",
                  color: message.startsWith("✅") ? "#4ade80" : "#f87171",
                }}
              >
                {message}
              </Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default Exchange;
