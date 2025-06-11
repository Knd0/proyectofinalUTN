import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../Loader/loader";
import Navbar from "../Navbar/Navbar";
import "./FakeCheckout.css"; // Asegurate de tener los estilos que te pasé antes

const FakeCheckout = () => {
  const navigate = useNavigate();

  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvc: "",
    cardName: "",
  });

  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData({ ...cardData, [name]: value });
  };

  const handleFakePayment = async () => {
    const { cardNumber, expiry, cvc } = cardData;

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

  const formatCardNumber = (num: string) => {
    return num.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  if (loading) return <Loader />;

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 px-4 py-10">

        {/* Tarjeta animada */}
        <div
          className={`flip-card ${isFlipped ? "flipped" : ""}`}
          onMouseEnter={() => setIsFlipped(true)}
          onMouseLeave={() => setIsFlipped(false)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <p className="heading_8264">MASTERCARD</p>
              <p className="number">
                {formatCardNumber(cardData.cardNumber) || "#### #### #### ####"}
              </p>
              <p className="date_8264">
                {cardData.expiry
                  ? cardData.expiry.slice(5) + "/" + cardData.expiry.slice(2, 4)
                  : "MM/YY"}
              </p>
              <p className="name">
                {cardData.cardName || "NOMBRE APELLIDO"}
              </p>
            </div>
            <div className="flip-card-back">
              <div className="strip"></div>
              <div className="mstrip"></div>
              <div className="sstrip">
                <p className="code">{cardData.cvc || "***"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="container max-w-md w-full p-6 border rounded shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Simulación de Pago</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium">Número de tarjeta</label>
            <input
              type="text"
              name="cardNumber"
              placeholder="4242 4242 4242 4242"
              className="border p-2 w-full"
              maxLength={19}
              value={cardData.cardNumber}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Nombre y Apellido</label>
            <input
              type="text"
              name="cardName"
              placeholder="Juan Pérez"
              className="border p-2 w-full"
              maxLength={30}
              value={cardData.cardName}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Vencimiento</label>
            <input
              type="date"
              name="expiry"
              className="border p-2 w-full"
              value={cardData.expiry}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">CVC</label>
            <input
              type="text"
              name="cvc"
              placeholder="123"
              className="border p-2 w-full"
              maxLength={4}
              value={cardData.cvc}
              onChange={handleChange}
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
      </div>
    </>
  );
};

export default FakeCheckout;
