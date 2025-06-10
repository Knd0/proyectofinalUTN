import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/loader";
import Navbar from "../Navbar/Navbar";

import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

const FakeCheckout = () => {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFakePayment = async () => {
    if (!cardNumber || !expiry || !cvc) {
      toast.error("Por favor completá todos los campos");
      return;
    }

    if (cardNumber.length < 16 || cvc.length < 3) {
      toast.error("Datos de tarjeta inválidos");
      return;
    }

    const amount = localStorage.getItem("fake_amount");
    const currency = localStorage.getItem("fake_currency");
    const token = localStorage.getItem("token");

    if (!token || !amount || !currency) {
      toast.error("Faltan datos para procesar el pago");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "https://proyectofinalutn-production.up.railway.app/auth/balance",
        {
          amount: parseFloat(amount),
          currency,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("✅ Saldo cargado correctamente");
      setTimeout(() => {
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al cargar el saldo");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('https://source.unsplash.com/featured/?creditcard,payment')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          bgcolor: "rgba(0,0,0,0.7)",
          backgroundBlendMode: "darken",
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={12}
            sx={{
              p: 4,
              borderRadius: 3,
              backdropFilter: "blur(8px)",
              bgcolor: "rgba(17, 24, 39, 0.85)",
              color: "white",
            }}
          >
            <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
              Simulación de Pago
            </Typography>

            <TextField
              fullWidth
              label="Número de tarjeta"
              placeholder="4242 4242 4242 4242"
              variant="outlined"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              inputProps={{ maxLength: 19 }}
              sx={muiInputStyle}
            />

            <TextField
              fullWidth
              label="Vencimiento"
              type="date"
              variant="outlined"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={muiInputStyle}
            />

            <TextField
              fullWidth
              label="CVC"
              placeholder="123"
              variant="outlined"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={muiInputStyle}
            />

            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
              }}
              onClick={handleFakePayment}
              disabled={loading}
            >
              Confirmar y pagar
            </Button>
          </Paper>
        </Container>
      </Box>

      <ToastContainer />
    </>
  );
};

const muiInputStyle = {
  mb: 2,
  input: { color: "white" },
  label: { color: "#9ca3af" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "#3b82f6" },
    "&:hover fieldset": { borderColor: "#60a5fa" },
    "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
  },
};

export default FakeCheckout;
