import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/loader";
import Navbar from "../Navbar/Navbar";

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
        "http://localhost:5000/auth/balance",
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

  return (
    <>
    <Navbar/>
    <div className="container max-w-md mx-auto mt-10 p-6 border rounded shadow-lg bg-white relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <Loader />
        </div>
      )}

      <h2 className="text-2xl font-bold mb-4">Simulación de Pago</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium">Número de tarjeta</label>
        <input
          type="text"
          placeholder="4242 4242 4242 4242"
          className="border p-2 w-full"
          maxLength={19}
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Vencimiento</label>
        <input
          type="date"
          placeholder="MM/AA"
          className="border p-2 w-full"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">CVC</label>
        <input
          type="text"
          placeholder="123"
          className="border p-2 w-full"
          maxLength={4}
          value={cvc}
          onChange={(e) => setCvc(e.target.value)}
        />
      </div>

      <button
        onClick={handleFakePayment}
        disabled={loading}
        className={`w-full py-2 rounded ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        } text-white`}
      >
        Confirmar y pagar
      </button>

      <ToastContainer />
    </div>
    </>
  );
};

export default FakeCheckout;
