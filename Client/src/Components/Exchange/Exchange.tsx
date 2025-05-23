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
  const [result, setResult] = useState<number | null>(null);
  const [balances, setBalances] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getBalances = async () => {
    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/auth/user", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      const data = await res.json();
      setBalances(data.COD);
    } catch (err) {
      console.error("Error al obtener balances:", err);
    }
  };

  useEffect(() => {
    getBalances();
  }, []);

  const handleExchange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setResult(null);

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          fromCurrency,
          toCurrency,
          amount: Number(amount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error inesperado");
      } else {
        setResult(data.convertedAmount);
        setMessage("✅ ¡Conversión exitosa!");
        setAmount("");
        getBalances();
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 text-white animate-gradient-x">
      <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
        Convertir monedas
      </h2>

      <form onSubmit={handleExchange} className="space-y-6">
        <input
          type="number"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-400 shadow-md"
        />

        <div className="grid grid-cols-2 gap-4">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold shadow-md"
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
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold shadow-md"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-xl font-extrabold text-indigo-600 bg-white hover:bg-indigo-50 transition duration-300 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          {loading ? "Procesando..." : "Convertir"}
        </button>
      </form>

      {result !== null && (
        <div className="mt-6 text-center text-2xl font-bold text-white/90">
          {amount} {fromCurrency} = {result.toFixed(4)} {toCurrency}
        </div>
      )}

      {message && (
        <p
          className={`mt-6 text-center text-lg font-bold ${
            message.includes("✅") ? "text-green-300" : "text-yellow-300"
          }`}
        >
          {message}
        </p>
      )}

      <div className="mt-8">
        <h3 className="text-white/70 font-semibold mb-3">Saldos actuales:</h3>
        {balances && typeof balances === "object" && (
          <ul className="grid grid-cols-3 gap-3 text-white/80 font-semibold">
            {Object.entries(balances).map(([cur, bal]) => (
              <li key={cur} className="bg-white/10 rounded-xl py-2 text-center">
                {cur}: {Number(bal).toFixed(4)}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        onClick={() => navigate("/home")}
        className="mt-10 w-full py-4 rounded-xl font-extrabold bg-white text-indigo-600 hover:bg-indigo-100"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Exchange;
