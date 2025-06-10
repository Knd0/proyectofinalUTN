import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "Components/Navbar/Navbar";

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Exchange: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [convertedValue, setConvertedValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [balances, setBalances] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  const fetchBalances = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.get("https://proyectofinalutn-production.up.railway.app/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBalances(res.data?.user.balance || {});
    } catch (error) {
      console.error("Error al obtener balances:", error);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      setExchangeRate(1);
      return;
    }
    const fetchRate = async () => {
      try {
        const res = await axios.get("https://api.currencyapi.com/v3/latest", {
          params: {
            apikey: "cur_live_5jkcaHmfOjUYaYuokyl4Z8NsWFOPibneBtiBIWpX",
            base_currency: fromCurrency,
            currencies: toCurrency,
          },
        });
        const rate = res.data?.data?.[toCurrency]?.value;
        setExchangeRate(rate);
      } catch {
        setExchangeRate(null);
      }
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedValue(amount * exchangeRate);
    } else {
      setConvertedValue(null);
    }
  }, [amount, exchangeRate]);

  const handleSwap = async () => {
    if (fromCurrency === toCurrency) {
      setMessage("Las monedas deben ser diferentes");
      return;
    }
    if (amount <= 0) {
      setMessage("La cantidad debe ser mayor que cero");
      return;
    }
    if ((balances[fromCurrency] || 0) < amount) {
      setMessage(`Saldo insuficiente en ${fromCurrency}`);
      return;
    }

    setLoading(true);
    setMessage("");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "https://proyectofinalutn-production.up.railway.app/exchange/me",
        { fromCurrency, toCurrency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(
        `✅ Convertiste ${amount} ${fromCurrency} a ${res.data.converted.toFixed(2)} ${toCurrency}. Redirigiendo...`
      );
      setAmount(0);
      setConvertedValue(null);
      await fetchBalances();

      setTimeout(() => navigate("/home"), 3000);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Error al realizar la conversión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl
          bg-gradient-to-r from-blue-600 via-blue-500 to-purple-500
          animate-gradient-x text-white font-sans"
        style={{ backgroundSize: "200% 200%" }}
      >
        <h2 className="text-4xl font-extrabold mb-8 text-center drop-shadow-lg">
          Convertir Saldo
        </h2>

        <div className="space-y-6">
          <input
            type="number"
            min="0"
            step="0.01"
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
              focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
              shadow-md transition duration-300 placeholder:text-gray-400"
            value={amount || ""}
            onChange={e => setAmount(parseFloat(e.target.value) || 0)}
            placeholder={`Cantidad disponible: ${balances[fromCurrency] ?? 0}`}
            disabled={loading}
          />

          <div className="flex gap-4">
            <select
              value={fromCurrency}
              onChange={e => setFromCurrency(e.target.value)}
              className="w-1/2 px-5 py-4 rounded-xl text-gray-900 font-semibold
                focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
                shadow-md transition duration-300"
              disabled={loading}
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={toCurrency}
              onChange={e => setToCurrency(e.target.value)}
              className="w-1/2 px-5 py-4 rounded-xl text-gray-900 font-semibold
                focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
                shadow-md transition duration-300"
              disabled={loading}
            >
              {currencies.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {exchangeRate !== null && amount > 0 && (
            <div className="text-center text-xl font-semibold drop-shadow-lg">
              {amount} {fromCurrency} ={" "}
              {convertedValue !== null ? convertedValue.toFixed(2) : "..."} {toCurrency}
            </div>
          )}

          <button
            onClick={handleSwap}
            disabled={loading}
            className={`w-full py-4 rounded-xl font-extrabold
              text-blue-600 bg-white hover:bg-blue-50 transition duration-300
              shadow-md ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Convirtiendo..." : "Convertir"}
          </button>

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${
                message.startsWith("✅") ? "text-green-400" : "text-red-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default Exchange;
