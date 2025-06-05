import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "Components/Navbar/Navbar";

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Exchange: React.FC = () => {
  const [fromCurrency, setFromCurrency] = useState("ARS");
  const [userInfo, setUserInfo] = useState<any>(null);
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
    try {
      const res = await axios.get("https://proyectofinalutn-production.up.railway.app/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Datos recibidos:", res.data);
      setBalances(res.data?.user.balance || {});
    } catch (err) {
      console.error("Error al obtener balances:", err);
    }
  };

  useEffect(() => {
    fetchBalances();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        return;
      }

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
      } catch (err) {
        console.error("Error al obtener tasa de cambio", err);
        setExchangeRate(null);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedValue(amount * exchangeRate);
    }
  }, [amount, exchangeRate]);

  const handleSwap = async () => {
    const token = localStorage.getItem("token");

    if (fromCurrency === toCurrency) return alert("Las monedas deben ser diferentes");
    if (amount <= 0) return alert("La cantidad debe ser mayor que cero");

    if ((balances[fromCurrency] || 0) < amount) {
      return alert(`Saldo insuficiente en ${fromCurrency}`);
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "https://proyectofinalutn-production.up.railway.app/exchange/me",
        { fromCurrency, toCurrency, amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(`✅ Convertiste ${amount} ${fromCurrency} a ${res.data.converted.toFixed(2)} ${toCurrency}. Redirigiendo...`);
      setAmount(0);
      setConvertedValue(null);
      await fetchBalances();

      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || "Error al realizar la conversión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar/>
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
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
            shadow-md transition duration-300 placeholder:text-gray-400"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          placeholder={`Cantidad disponible: ${balances[fromCurrency] ?? 0}`}
          min="0"
          disabled={loading}
        />

        <div className="flex gap-4">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="w-1/2 px-5 py-4 rounded-xl text-gray-900 font-semibold
              focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
              shadow-md transition duration-300"
            disabled={loading}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="w-1/2 px-5 py-4 rounded-xl text-gray-900 font-semibold
              focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
              shadow-md transition duration-300"
            disabled={loading}
          >
            {currencies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {exchangeRate !== null && amount > 0 && (
          <div className="text-white/80 text-center text-sm font-medium drop-shadow-md">
            <p>Tasa actual: <strong>1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</strong></p>
            <p>Recibirás: <strong>{convertedValue?.toFixed(2)} {toCurrency}</strong></p>
          </div>
        )}

        {/* LISTA DE BALANCES DEL USUARIO */}
        {Object.keys(balances).length > 0 && (
          <div className="mt-4 bg-white/10 p-4 rounded-xl shadow-inner">
            <h3 className="font-bold mb-2 text-white">Balances disponibles:</h3>
            <ul className="text-sm text-white/90 space-y-1">
              {Object.entries(balances).map(([currency, value]) => (
                <li key={currency}>
                  {currency}: {Number(value).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleSwap}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-extrabold
            text-blue-600 bg-white hover:bg-blue-50 transition duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? "Procesando..." : "Convertir"}
        </button>

        {message && (
          <p
            className={`mt-6 text-center text-lg font-bold drop-shadow-lg
              ${message.includes("✅") ? "text-green-300 animate-fadeIn" : "text-yellow-300 animate-fadeIn"}`}
            style={{ animationDuration: "1s" }}
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
