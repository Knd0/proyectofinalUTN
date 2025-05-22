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

    <div>
      <Navbar/>
      <h2 className="text-xl font-bold mb-4">Cargar saldo</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit}>

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
