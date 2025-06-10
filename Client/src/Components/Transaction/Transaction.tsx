import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "Components/Navbar/Navbar";

type TransactionProps = {
  userInfo?: { nombre?: string };
};

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Transaction: React.FC<TransactionProps> = ({ userInfo }) => {
  const [toCvu, setToCvu] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);
  const navigate = useNavigate();

  const validateInput = () => {
    if (!toCvu.trim()) {
      setMessage({ text: "El CVU destino es obligatorio", type: "error" });
      return false;
    }
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setMessage({ text: "El monto debe ser un número positivo", type: "error" });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateInput()) return;

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toUserCvu: toCvu.trim(),
          amount: parseFloat(amount),
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Error inesperado", type: "error" });
      } else {
        setMessage({ text: "✅ ¡Transacción realizada con éxito!", type: "success" });
        setToCvu("");
        setAmount("");
      }
    } catch {
      setMessage({ text: "Error al conectar con el servidor", type: "error" });
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
          Transferir saldo
        </h2>

        {userInfo?.nombre && (
          <p className="text-center mb-4 font-medium text-white/80">
            Usuario: <span className="font-bold">{userInfo.nombre}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="CVU destino"
            value={toCvu}
            onChange={(e) => setToCvu(e.target.value)}
            disabled={loading}
            required
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
            shadow-md transition duration-300 placeholder:text-gray-400"
            autoComplete="off"
          />

          <input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Monto"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
            shadow-md transition duration-300 placeholder:text-gray-400"
          />

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            disabled={loading}
            className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-70
            shadow-md transition duration-300"
          >
            {currencies.map((cur) => (
              <option key={cur} value={cur}>
                {cur}
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-extrabold
            text-blue-600 bg-white hover:bg-blue-50 transition duration-300
            disabled:opacity-50 disabled:cursor-not-allowed
            ${loading ? "animate-pulse" : ""}`}
          >
            {loading ? "Procesando..." : "Enviar"}
          </button>
        </form>

        {message && (
          <p
            className={`mt-6 text-center text-lg font-bold drop-shadow-lg
            ${message.type === "success" ? "text-green-300 animate-fadeIn" : "text-yellow-300 animate-fadeIn"}`}
            style={{ animationDuration: "1s" }}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}

        <button
          onClick={() => navigate("/home")}
          disabled={loading}
          className="mt-8 w-full py-4 rounded-xl font-extrabold
          bg-white text-blue-600 hover:bg-blue-50 transition duration-300"
        >
          Volver al Inicio
        </button>
      </div>
    </>
  );
};

export default Transaction;
