
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "../Navbar/Navbar";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (amount <= 0) {
      setError("El monto debe ser mayor a 0");
      return;
    }


    // Guardar datos en localStorage para simular el pago
    localStorage.setItem("fake_amount", amount.toString());
    localStorage.setItem("fake_currency", currency);

    toast.info("Redirigiendo a la simulación de pago...");
    setTimeout(() => {
      window.location.href = "/fake-checkout";
    }, 1000);

  };

  return (

    <div className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl
  bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-500
  animate-gradient-x text-white font-sans"
  style={{ backgroundSize: "200% 200%" }}>
      <Navbar/>
      
  <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
    Cargar saldo
  </h2>

  {error && (
    <p className="text-center mb-4 text-red-300 font-semibold animate-fadeIn">
      {error}
    </p>
  )}

  <form onSubmit={handleSubmit} className="space-y-6">
    <input
      type="number"
      step="0.01"
      min="0.01"
      value={amount}
      onChange={handleAmountChange}
      placeholder="Monto"
      required
      className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
      focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-70
      shadow-md transition duration-300 placeholder:text-gray-400"
    />

    <select
      value={currency}
      onChange={handleCurrencyChange}
      className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
      focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-70
      shadow-md transition duration-300"
    >
      <option value="ARS">ARS</option>
      <option value="USD">USD</option>
      <option value="EUR">EUR</option>
      <option value="USDT">USDT</option>
      <option value="BTC">BTC</option>
      <option value="ETH">ETH</option>
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

  );
};

export default LoadBalance;
