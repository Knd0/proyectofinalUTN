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

// Estilos de la tarjeta flip-card
import "./FakeCheckout.css";

const FakeCheckout = () => {
  const navigate = useNavigate();

  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cardName, setCardName] = useState("");
  const [cvc, setCvc] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFakePayment = async () => {
    if (!cardNumber || !expiry || !cvc || !cardName) {
      toast.error("Por favor completá todos los campos");
      return;
    }

    if (cardNumber.replace(/\s/g, "").length < 16 || cvc.length < 3) {
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

  const formatCardNumber = (num: string) =>
    num
      .replace(/\W/gi, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();

  return (
    <>
      <Navbar />
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <div
          className={`flip-card ${isFlipped ? "flipped" : ""}`}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <p className="heading_8264">MASTERCARD</p>
              <p className="number">
                {formatCardNumber(cardNumber) || "#### #### #### ####"}
              </p>
              <p className="date_8264">
                {expiry ? expiry.slice(5) + "/" + expiry.slice(2, 4) : "MM/YY"}
              </p>
              <p className="name">{cardName || "NOMBRE APELLIDO"}</p>
            </div>
            <div className="flip-card-back">
              <div className="strip"></div>
              <div className="mstrip"></div>
              <div className="sstrip">
                <p className="code">{cvc || "***"}</p>
              </div>
            </div>
          </div>
        </div>
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
