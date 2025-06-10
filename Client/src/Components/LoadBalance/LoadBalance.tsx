import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
import "react-toastify/dist/ReactToastify.css";

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
    setTimeout(() => window.location.href = "/fake-checkout", 1500);
  };

  return (
    <>
      <Navbar />
      <div
        className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl
        bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500
        animate-gradient-x text-white font-sans"
        style={{ backgroundSize: "200% 200%" }}
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
          Cargar saldo
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={amount || ""}
            onChange={e => setAmount(Number(e.target.value))}
            placeholder="Monto"
            required
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-70
              shadow-md transition duration-300 placeholder:text-gray-400"
          />

          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
              focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-70
              shadow-md transition duration-300"
          >
            {currencies.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full py-4 rounded-xl font-extrabold
              text-blue-600 bg-white hover:bg-blue-50 transition duration-300
              shadow-md"
          >
            Cargar saldo
          </button>
        </form>

        <ToastContainer />
      </div>
    </>
  );
};

export default LoadBalance;
