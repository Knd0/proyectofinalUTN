import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

type TransactionProps = {
  userInfo?: any;
};

const currencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];

const Transaction: React.FC<TransactionProps> = ({ userInfo }) => {
  const [toCvu, setToCvu] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("ARS");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5000/transactions/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({
          toUserCvu: toCvu,
          amount: Number(amount),
          currency,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Error inesperado");
      } else {
        setMessage("✅ ¡Transacción realizada con éxito!");
        setToCvu("");
        setAmount("");
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor");
    }

    setLoading(false);
  };

  return (
    <div
      className="max-w-md mx-auto p-8 rounded-3xl shadow-2xl
      bg-gradient-to-r from-purple-600 via-pink-500 to-red-500
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
          required
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
          focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-70
          shadow-md transition duration-300 placeholder:text-gray-400"
        />

        <input
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Monto"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
          focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-70
          shadow-md transition duration-300 placeholder:text-gray-400"
        />

        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className="w-full px-5 py-4 rounded-xl text-gray-900 font-semibold
          focus:outline-none focus:ring-4 focus:ring-pink-400 focus:ring-opacity-70
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
          text-pink-600 bg-white hover:bg-pink-50 transition duration-300
          disabled:opacity-50 disabled:cursor-not-allowed
          ${loading ? "animate-pulse" : ""}`}
        >
          {loading ? "Procesando..." : "Enviar"}
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-center text-lg font-bold drop-shadow-lg
          ${
            message.includes("✅")
              ? "text-green-300 animate-fadeIn"
              : "text-yellow-300 animate-fadeIn"
          }`}
          style={{ animationDuration: "1s" }}
        >
          {message}
        </p>
      )}

      <button
        onClick={() => navigate("/home")}
        className="mt-8 w-full py-4 rounded-xl font-extrabold
        bg-white text-pink-600 hover:bg-pink-50 transition duration-300"
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default Transaction;