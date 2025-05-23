import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ExchangeProps = {
  userInfo?: any;
};

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Exchange: React.FC<ExchangeProps> = ({ userInfo }) => {
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  // Inicializamos con objeto vacío para evitar errores
  const [balances, setBalances] = useState<Record<string, number>>({});
  const navigate = useNavigate();

  useEffect(() => {
    if (userInfo?.COD) {
      setBalances(userInfo.COD);
    }
  }, [userInfo]);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setResult(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setMessage("Ingrese un monto válido mayor a 0");
      return;
    }
    if (fromCurrency === toCurrency) {
      setMessage("Las monedas deben ser diferentes");
      return;
    }
    if (!balances || parsedAmount > (balances[fromCurrency] || 0)) {
      setMessage("Saldo insuficiente");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://proyectofinalutn-production.up.railway.app/exchange",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            fromCurrency,
            toCurrency,
            amount: parsedAmount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Error inesperado");
      } else {
        setResult(data.convertedAmount);
        setBalances(data.balances);
        setMessage("✅ Conversión realizada con éxito");
        setAmount("");
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl bg-blue-800 text-white font-sans">
      <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
        Conversor de monedas
      </h2>

      {userInfo?.nombre && (
        <p className="text-center mb-4 font-medium text-white/80">
          Usuario: <span className="font-bold">{userInfo.nombre}</span>
        </p>
      )}

      <form onSubmit={handleConvert} className="space-y-6">
        <div className="flex gap-4">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="flex-1 px-5 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Monto a convertir"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-blue-300 shadow-md placeholder:text-gray-400"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-extrabold bg-white text-blue-700 hover:bg-blue-100 transition duration-300 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {loading ? "Convirtiendo..." : "Convertir"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-center text-lg font-bold drop-shadow-lg ${
            message.includes("✅") ? "text-green-300" : "text-yellow-300"
          }`}
        >
          {message}
        </p>
      )}

      {result !== null && (
        <div className="mt-6 text-center text-2xl font-bold text-white/90">
          {amount} {fromCurrency} = {result.toFixed(4)} {toCurrency}
        </div>
      )}

      {balances && Object.entries(balances).length > 0 && (
        <div className="mt-8">
          <h3 className="text-white/70 font-semibold mb-3">Saldos actuales:</h3>
          <ul className="grid grid-cols-3 gap-3 text-white/80 font-semibold">
            {Object.entries(balances).map(([cur, bal]) => (
              <li key={cur} className="bg-white/10 rounded-xl py-2 text-center">
                {cur}: {bal.toFixed(4)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={() => navigate("/home")}
        className="mt-10 w-full py-4 rounded-xl font-extrabold bg-white text-blue-700 hover:bg-blue-100 transition duration-300"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Exchange;
