// src/components/TransactionHistory.tsx
// Componente que muestra un historial de transacciones enviadas y recibidas por el usuario

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Paper,
  Chip,
  Alert,
} from "@mui/material";
import NorthEastIcon from '@mui/icons-material/NorthEast'; // Ícono para transacciones enviadas
import SouthWestIcon from '@mui/icons-material/SouthWest'; // Ícono para transacciones recibidas

// Definición del tipo de transacción
interface Transaction {
  id: number;
  amount: number;
  currency: string;
  date: string;
  type: "sent" | "received";
  toUser?: { nombre: string; cvu: string };
  fromUser?: { nombre: string; cvu: string };
}

// Generador de número de operación con formato OP-00000042
const generateOperationNumber = (id: number) =>
  `OP-${String(id).padStart(8, "0")}`;

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]); // Lista de transacciones
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState<string | null>(null); // Estado de error

  // Efecto que se ejecuta al montar el componente
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No hay token de autenticación.");

        // Fetch al endpoint de todas las transacciones
        const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al obtener transacciones");
        }

        const data: Transaction[] = await res.json();
        // Ordena de más reciente a más antigua
        const sortedData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTransactions(sortedData);
      } catch (err) {
        console.error("❌ Error al cargar transacciones:", err);
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado al cargar las transacciones.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Estado de carga: spinner + texto
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, mt: 4 }}>
        <CircularProgress sx={{ color: "#90caf9" }} />
        <Typography variant="body1" sx={{ ml: 2, color: "#b0bec5" }}>
          Cargando transacciones...
        </Typography>
      </Box>
    );
  }

  // Estado de error: alerta roja
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Typography variant="body1" sx={{ color: "#fff" }}>
          Hubo un problema al cargar el historial: <strong>{error}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "#ccc" }}>
          Recargá la página o contactá soporte si el problema persiste.
        </Typography>
      </Alert>
    );
  }

  // No hay transacciones: alerta informativa
  if (transactions.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Typography variant="h6" component="p" sx={{ color: "#90caf9" }}>
          ¡Aún no hay transacciones!
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, color: "#90caf9" }}>
          Realizá tu primera operación para verla reflejada aquí.
        </Typography>
      </Alert>
    );
  }

  // Render del historial de transacciones
  return (
    <Paper
      elevation={8}
      sx={{
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        mt: 8,
        p: { xs: 2, sm: 4 },
        borderRadius: 3,
        bgcolor: "#1e1e1e",
        boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4, color: "#90caf9", textAlign: "center" }}>
        Historial de Transacciones
      </Typography>

      <List>
        {transactions.map((tx, index) => {
          const isReceived = tx.type === "received"; // Tipo de transacción
          const counterparty = isReceived ? tx.fromUser : tx.toUser; // Usuario contrario
          const iconColor = isReceived ? "#66bb6a" : "#ef5350";
          const amountColor = isReceived ? "#81c784" : "#ef9a9a";

          return (
            <React.Fragment key={tx.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  px: 2,
                  borderRadius: 2,
                  transition: "background-color 0.2s",
                  "&:hover": {
                    bgcolor: "#2c2c2c",
                  },
                }}
              >
                {/* Ícono de dirección */}
                <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}>
                  {isReceived ? (
                    <SouthWestIcon sx={{ color: iconColor, fontSize: 30 }} />
                  ) : (
                    <NorthEastIcon sx={{ color: iconColor, fontSize: 30 }} />
                  )}
                </ListItemIcon>

                {/* Info principal y secundaria */}
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#fff" }}>
                      {isReceived ? "Recibido de" : "Enviado a"}:{" "}
                      <Box component="span" sx={{ color: "#90caf9", fontWeight: "bold" }}>
                        {counterparty?.nombre || "Usuario desconocido"}
                      </Box>
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2" sx={{ color: "#b0bec5" }}>
                        CVU: {counterparty?.cvu || "N/A"}
                      </Typography>
                      <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {/* Chips de detalles */}
                        <Chip
                          label={`Nº operación: ${generateOperationNumber(tx.id)}`}
                          size="small"
                          sx={{
                            bgcolor: "transparent",
                            color: "#90caf9",
                            borderColor: "#90caf9",
                            fontSize: "0.75rem",
                          }}
                          variant="outlined"
                        />
                        <Chip
                          label={`Fecha: ${new Date(tx.date).toLocaleString()}`}
                          size="small"
                          sx={{
                            bgcolor: "transparent",
                            color: "#b0bec5",
                            borderColor: "#555",
                            fontSize: "0.75rem",
                          }}
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />

                {/* Monto con signo y color */}
                <Box sx={{ textAlign: "right", ml: 2 }}>
                  <Typography variant="h6" sx={{ color: amountColor, fontWeight: "bold" }}>
                    {isReceived ? "+" : "-"}{tx.amount} {tx.currency}
                  </Typography>
                </Box>
              </ListItem>

              {/* Separador entre elementos */}
              {index < transactions.length - 1 && (
                <Divider sx={{ my: 1, borderColor: "#444" }} />
              )}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default TransactionHistory;
