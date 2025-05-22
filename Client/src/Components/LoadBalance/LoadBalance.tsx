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
      const token = localStorage.getItem("token");
      console.log("Token:", token);

      const response = await fetch(
        "https://proyectofinalutn-production.up.railway.app/auth/create-preference",
        {
          method: "POST", // Debe ser POST
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount, currency }), // Convertir a JSON string
        }
      );

      if (!response.ok) throw new Error("Error en la respuesta del servidor");

      const data = await response.json();
      toast.success("Redirigiendo a Mercado Pago...");
      window.location.href = data.init_point;
    } catch (err) {
      console.error(err);
      toast.error("Error al generar el pago");
    }
  };
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Cargar saldo
      </h2>

      {error && (
        <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="number"
          step="0.01"
          min="0.01"
          value={amount}
          onChange={handleAmountChange}
          placeholder="Monto"
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <select
          value={currency}
          onChange={handleCurrencyChange}
          className="w-full border border-gray-300 rounded-lg p-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Cargar saldo
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default LoadBalance;
