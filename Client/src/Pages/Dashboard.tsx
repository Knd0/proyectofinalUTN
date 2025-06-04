import React, { useEffect, useState } from "react";
import axios from "axios";

interface Transaction {
  id: number;
  amount: number;
  currency: string;
  date: string;
  fromUser: {
    id: number;
    nombre: string;
  };
  toUser: {
    id: number;
    nombre: string;
  };
}

interface Usuario {
  id: number;
  nombre: string;
  email: string;
  imagen?: string;
  descripcion?: string;
  nacionalidad?: string;
  dni?: string;
  COD: { [key: string]: number };
  sentTransactions: Transaction[];
  receivedTransactions: Transaction[];
}

const DashboardAdmin = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:3001/admin/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsuarios(data.users);
      } catch (error) {
        console.error("❌ Error al cargar los usuarios:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard de Administrador</h2>

      {usuarios.map(usuario => (
        <div key={usuario.id} className="mb-6 p-4 border rounded shadow">
          <h3 className="text-xl font-semibold">{usuario.nombre} (ID: {usuario.id})</h3>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>DNI:</strong> {usuario.dni || "No especificado"}</p>
          <p><strong>Nacionalidad:</strong> {usuario.nacionalidad || "No especificada"}</p>
          <p><strong>Descripción:</strong> {usuario.descripcion || "No especificada"}</p>

          <h4 className="mt-4 font-semibold">Balances:</h4>
          <ul className="list-disc list-inside">
            {Object.entries(usuario.COD).map(([moneda, valor]) => (
              <li key={moneda}>{moneda}: {valor}</li>
            ))}
          </ul>

          <h4 className="mt-4 font-semibold text-blue-600">Transacciones Enviadas:</h4>
          {usuario.sentTransactions.length > 0 ? (
            <ul className="list-disc list-inside">
              {usuario.sentTransactions.map(tx => (
                <li key={tx.id}>
                  A <strong>{tx.toUser?.nombre}</strong> (ID {tx.toUser?.id}) - {tx.amount} {tx.currency} el {new Date(tx.date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tiene transacciones enviadas.</p>
          )}

          <h4 className="mt-4 font-semibold text-green-600">Transacciones Recibidas:</h4>
          {usuario.receivedTransactions.length > 0 ? (
            <ul className="list-disc list-inside">
              {usuario.receivedTransactions.map(tx => (
                <li key={tx.id}>
                  De <strong>{tx.fromUser?.nombre}</strong> (ID {tx.fromUser?.id}) - {tx.amount} {tx.currency} el {new Date(tx.date).toLocaleString()}
                </li>
              ))}
            </ul>
          ) : (
            <p>No tiene transacciones recibidas.</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DashboardAdmin;
