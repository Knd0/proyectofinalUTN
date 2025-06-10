// src/components/TransactionHistory.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress, // For loading state
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider, // To separate list items
  Paper, // As a container similar to a Card
  Chip, // For operation number
  Alert, // For no transactions message
} from "@mui/material";
import NorthEastIcon from '@mui/icons-material/NorthEast'; // For sent transactions
import SouthWestIcon from '@mui/icons-material/SouthWest'; // For received transactions
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // For general transaction list icon

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
  const [error, setError] = useState<string | null>(null); // State for error messages

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No hay token de autenticación.");
        }

        const res = await fetch("https://proyectofinalutn-production.up.railway.app/transactions/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error al obtener transacciones");
        }

        const data: Transaction[] = await res.json();
        // Sort transactions by date in descending order (most recent first)
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200, mt: 4 }}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>Cargando transacciones...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Typography variant="body1">
          Hubo un problema al cargar el historial de transacciones: <strong>{error}</strong>
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Por favor, intentá recargar la página o contactá con soporte si el problema persiste.
        </Typography>
      </Alert>
    );
  }

  if (transactions.length === 0) {
    return (
      <Alert severity="info" sx={{ mt: 4, mx: 'auto', maxWidth: 600 }}>
        <Typography variant="h6" component="p">
          ¡Aún no hay transacciones!
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Realizá tu primera operación para verla reflejada aquí.
        </Typography>
      </Alert>
    );
  }

  return (
    <Paper
      elevation={8} // Higher elevation for a more prominent look
      sx={{
        width: "100%",
        maxWidth: 900, // Adjusted max-width for better use of space
        mx: "auto",
        mt: 8, // Margin top for spacing from other sections
        p: { xs: 2, sm: 4 }, // Responsive padding
        borderRadius: 3, // Consistent rounded corners
        bgcolor: 'background.paper', // Uses theme paper background
        boxShadow: '0 6px 20px rgba(0,0,0,0.25)', // Custom, softer shadow
      }}
    >
      <Typography variant="h4" component="h2" sx={{ fontWeight: "bold", mb: 4, color: 'primary.dark', textAlign: 'center' }}>
        Historial de Transacciones
      </Typography>

      <List sx={{ width: '100%' }}>
        {transactions.map((tx, index) => {
          const isReceived = tx.type === "received";
          const counterparty = isReceived ? tx.fromUser : tx.toUser;
          const iconColor = isReceived ? "success.main" : "error.main";
          const amountColor = isReceived ? "success.dark" : "error.dark";

          return (
            <React.Fragment key={tx.id}>
              <ListItem
                alignItems="flex-start"
                sx={{
                  py: 2,
                  px: { xs: 0, sm: 2 }, // Adjusted padding for list items
                  transition: "background-color 0.3s ease-in-out",
                  "&:hover": {
                    bgcolor: 'action.hover', // Subtle hover effect from theme
                    borderRadius: 1,
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, pt: 0.5 }}>
                  {isReceived ? (
                    <SouthWestIcon sx={{ color: iconColor, fontSize: 30 }} />
                  ) : (
                    <NorthEastIcon sx={{ color: iconColor, fontSize: 30 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" component="span" sx={{ fontWeight: "bold", color: 'text.primary' }}>
                      {isReceived ? "Recibido de" : "Enviado a"}:{" "}
                      <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                        {counterparty?.nombre || "Usuario desconocido"}
                      </Box>
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ mt: 1 }}>
                      <Typography component="span" variant="body2" color="text.secondary">
                        CVU: {counterparty?.cvu || "N/A"}
                      </Typography>
                      <br />
                      <Chip
                        label={`Nº de operación: ${generateOperationNumber(tx.id)}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ mt: 1, mr: 1, fontSize: '0.75rem' }}
                      />
                      <Chip
                        label={`Fecha: ${new Date(tx.date).toLocaleString()}`}
                        size="small"
                        color="default"
                        variant="outlined"
                        sx={{ mt: 1, fontSize: '0.75rem' }}
                      />
                    </Box>
                  }
                />
                <Box sx={{ textAlign: 'right', ml: 2 }}>
                  <Typography variant="h5" component="p" sx={{ fontWeight: "extrabold", color: amountColor, letterSpacing: -0.5 }}>
                    {isReceived ? "+" : "-"}
                    {tx.amount} {tx.currency}
                  </Typography>
                  {/* Potentially add a secondary amount in local currency if available */}
                </Box>
              </ListItem>
              {index < transactions.length - 1 && <Divider component="li" sx={{ my: 1, borderColor: 'divider' }} />}
            </React.Fragment>
          );
        })}
      </List>
    </Paper>
  );
};

export default TransactionHistory;