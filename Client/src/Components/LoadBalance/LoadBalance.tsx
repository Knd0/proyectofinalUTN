import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoadBalance = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<string>("ARS");
  const [error, setError] = useState<string>("");

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(Number(e.target.value));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrency(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (amount <= 0) {
    setError("El monto debe ser mayor a 0");
    return;
  }

  try {
    const token = localStorage.getItem("token"); // o donde tengas guardado el JWT
    if (!token) {
      toast.error("No estás autenticado");
      return;
    }

    const response = await axios.post(
      "http://localhost:5000/auth/create-preference",
      { amount, currency },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const { init_point } = response.data;
    toast.success("Redirigiendo a Mercado Pago...");
    window.location.href = init_point;
  } catch (err) {
    console.error(err);
    toast.error("Error al generar el pago");
  }
};

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Cargar saldo</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          step="0.01" // 🟢 Acepta valores con 2 decimales
          min="0.01" // 🟢 Evita valores negativos o cero
          value={amount}
          onChange={handleAmountChange}
          placeholder="Monto"
          className="border p-2 mb-2 w-full"
        />
        <select
          value={currency}
          onChange={handleCurrencyChange}
          className="border p-2 mb-2 w-full"
        >
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cargar saldo
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LoadBalance;
