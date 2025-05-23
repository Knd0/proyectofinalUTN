// src/components/TransactionHistory.tsx
import React, { useEffect, useState } from "react";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  date: string;
  type: "sent" | "received";
  toUser?: {
    nombre: string;
    cvu: string;
  };
  fromUser?: {
    nombre: string;
    cvu: string;
  };
}


const generateOperationNumber = (id: number) =>
  `OP-${String(id).padStart(8, "0")}`;

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Error al obtener transacciones");
        }

        const data = await res.json();
        setTransactions(data);
      } catch (error) {
        console.error("❌", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Cargando transacciones...</p>;
  }

  if (transactions.length === 0) {
    return <p className="text-center mt-8">No hay transacciones registradas.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-black">Historial de Transacciones</h2>
      <ul className="space-y-4">
        {transactions.map((tx) => {
  const isReceived = tx.type === "received";
  const counterparty = isReceived ? tx.fromUser : tx.toUser;

  return (
    <li
  key={tx.id}
  className="flex justify-between items-center gap-4 p-4 mb-4 rounded-xl shadow-sm
    border-l-4 border-blue-500 bg-white hover:bg-blue-50 transition-all duration-200"
>
  <div>
    <p className="text-lg font-semibold text-gray-900">
      {isReceived ? "Recibido de" : "Enviado a"}:{" "}
      <span className="font-bold">{counterparty?.nombre || "Desconocido"}</span>
    </p>
    <p className="text-sm text-gray-500">CVU: {counterparty?.cvu}</p>
    <p className="text-sm text-gray-400">
      Nº de operación:{" "}
      <span className="font-medium text-gray-600">{generateOperationNumber(tx.id)}</span>
    </p>
    <p className="text-sm text-gray-400">
      Fecha:{" "}
      <span className="text-gray-600">
        {new Date(tx.date).toLocaleString()}
      </span>
    </p>
  </div>

  <div className="text-right">
    <p className="text-2xl font-extrabold tracking-tight text-blue-600">
      {isReceived ? "+" : "-"}
      {tx.amount} {tx.currency}
    </p>
  </div>
</li>

  );
})}

      </ul>
    </div>
  );
};

export default TransactionHistory;
