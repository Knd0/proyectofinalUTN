// Importación de hooks y librerías necesarias
import React, { useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/loader";
import Navbar from "../Navbar/Navbar";

// Tipado para los props de la tarjeta visual
interface CardPreviewProps {
  cardNumber: string;
  expiry: string;
  cvc: string;
}

// Componente para previsualizar la tarjeta
const CardPreview: React.FC<CardPreviewProps> = ({ cardNumber, expiry, cvc }) => {
  const formatCardNumber = (num: string): string =>
    num.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();

  const formatExpiry = (date: string): string => {
    if (!date) return "MM/YY";
    const [year, month] = date.split("-");
    return `${month || "MM"}/${year ? year.slice(2) : "YY"}`;
  };

  const displayCvc = cvc || "•••";

  return (
    <div className="flip-card" style={{ width: "350px", height: "200px", perspective: "1000px" }}>
      <div
        className="flip-card-inner"
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          textAlign: "left",
          borderRadius: "15px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.3)",
          backgroundColor: "#323232",
          color: "white",
          padding: "20px",
          boxSizing: "border-box",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div className="flip-card-front" style={{ position: "absolute", backfaceVisibility: "hidden" }}>
          <p className="heading_8264" style={{ fontWeight: "bold", fontSize: "18px", letterSpacing: "2px" }}>
            MASTERCARD
          </p>

          {/* Logo de Mastercard en SVG */}
          <svg className="logo" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48" style={{ position: "absolute", top: "20px", right: "20px" }}>
            <circle cx="16" cy="24" r="14" fill="#d50000" />
            <circle cx="32" cy="24" r="14" fill="#ff9800" />
            <path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48C20.376,15.05,18,19.245,18,24z" />
          </svg>

          {/* Chip en SVG */}
          <svg className="chip" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 50 50" style={{ marginTop: "40px" }}>
            <rect x="10" y="10" width="30" height="20" rx="4" ry="4" fill="#c0c0c0" stroke="#888" strokeWidth="1" />
          </svg>

          {/* Número de tarjeta formateado */}
          <div style={{ marginTop: "30px", fontSize: "22px", letterSpacing: "3px", fontWeight: "600" }}>
            {cardNumber ? formatCardNumber(cardNumber) : "#### #### #### ####"}
          </div>

          {/* Vencimiento y CVC */}
          <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between", fontSize: "14px", letterSpacing: "1.5px" }}>
            <div>
              <div style={{ opacity: 0.7, fontSize: "12px" }}>VALID THRU</div>
              <div>{formatExpiry(expiry)}</div>
            </div>
            <div>
              <div style={{ opacity: 0.7, fontSize: "12px" }}>CVC</div>
              <div>{displayCvc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal FakeCheckout
const FakeCheckout: React.FC = () => {
  const navigate = useNavigate();

  // Estados locales para inputs y loading
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiry, setExpiry] = useState<string>("");
  const [cvc, setCvc] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Simulación de pago con datos de localStorage
  const handleFakePayment = async () => {
    if (!cardNumber || !expiry || !cvc) {
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
        { amount: parseFloat(amount), currency },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("✅ Saldo cargado correctamente");
      setTimeout(() => navigate("/home"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Error al cargar el saldo");
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de inputs
  const handleCardNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "").slice(0, 16);
    let formatted = "";
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += value[i];
    }
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setExpiry(e.target.value);
  };

  const handleCvcChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 4);
    setCvc(value);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-10 p-6 border rounded shadow-lg bg-white relative flex flex-col md:flex-row gap-8 max-w-5xl">
        {/* Formulario de pago */}
        <div className="flex-1 max-w-md">
          <h2 className="text-2xl font-bold mb-6">Simulación de Pago</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Número de tarjeta</label>
            <input
              type="text"
              placeholder="4242 4242 4242 4242"
              className="border p-2 w-full rounded"
              maxLength={19}
              value={cardNumber}
              onChange={handleCardNumberChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Vencimiento</label>
            <input
              type="month"
              className="border p-2 w-full rounded"
              value={expiry}
              onChange={handleExpiryChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">CVC</label>
            <input
              type="text"
              placeholder="123"
              className="border p-2 w-full rounded"
              maxLength={4}
              value={cvc}
              onChange={handleCvcChange}
            />
          </div>

          <button
            onClick={handleFakePayment}
            className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700 w-full"
          >
            Pagar
          </button>
        </div>

        {/* Visualización de tarjeta */}
        <div className="flex-1 flex justify-center items-center">
          <CardPreview cardNumber={cardNumber} expiry={expiry} cvc={cvc} />
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default FakeCheckout;
