import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Typography,
  Collapse,
  Box, // For flexible box layouts
  Alert, // For error messages
  Divider, // For separating content
  Stack,
  Container,
  List,
  ListItem,
  ListItemText, // For horizontal/vertical spacing
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Icon for user name
import EmailIcon from '@mui/icons-material/Email'; // Icon for email
import SendIcon from '@mui/icons-material/Send'; // For sent transactions
import CallReceivedIcon from '@mui/icons-material/CallReceived'; // For received transactions
import DashboardIcon from '@mui/icons-material/Dashboard'; // Main dashboard icon
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'; // Error icon

import Navbar from "Components/Navbar/Navbar"; // Assuming this path is correct

// --- Interfaces (No changes needed, but keeping for completeness) ---
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
  admin: boolean;
  COD: { [key: string]: number }; // Assuming COD is for balances
  sentTransactions: Transaction[];
  receivedTransactions: Transaction[];
}

// --- Helper component for Collapsible Row Content ---
interface RowContentProps {
  user: Usuario;
}

const RowContent: React.FC<RowContentProps> = ({ user }) => (
  <Box sx={{ margin: 1, py: 2, px: 3, bgcolor: 'action.hover', borderRadius: 2 }}>
    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'primary.dark' }}>
      Detalles del Usuario
    </Typography>
    <Stack spacing={1} sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary">
        DNI: <Typography component="span" variant="body1" sx={{ fontWeight: 'medium' }}>{user.dni || 'No especificado'}</Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Nacionalidad: <Typography component="span" variant="body1" sx={{ fontWeight: 'medium' }}>{user.nacionalidad || 'No especificado'}</Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Admin: <Typography component="span" variant="body1" sx={{ fontWeight: 'medium', color: user.admin ? 'success.main' : 'error.main' }}>{user.admin ? 'Sí' : 'No'}</Typography>
      </Typography>
      <Typography variant="body2" color="text.secondary">
        ID: <Typography component="span" variant="body1" sx={{ fontWeight: 'medium' }}>{user.id}</Typography>
      </Typography>
    </Stack>

    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      <SendIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'error.main' }} /> Transacciones Enviadas
    </Typography>
    {user.sentTransactions?.length ? (
      <List sx={{ ml: 2 }}> {/* Using MUI List for better styling */}
        {user.sentTransactions.map((t) => (
          <ListItem key={t.id} sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  A: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{t.toUser.nombre}</Box> (ID: {t.toUser.id})
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Monto: <Box component="span" sx={{ color: 'error.dark', fontWeight: 'bold' }}>-${t.amount} {t.currency}</Box> - Fecha: {new Date(t.date).toLocaleString()}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
        No hay transacciones enviadas
      </Typography>
    )}

    <Divider sx={{ my: 2 }} />

    <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      <CallReceivedIcon sx={{ verticalAlign: 'middle', mr: 1, color: 'success.main' }} /> Transacciones Recibidas
    </Typography>
    {user.receivedTransactions?.length ? (
      <List sx={{ ml: 2 }}> {/* Using MUI List for better styling */}
        {user.receivedTransactions.map((t) => (
          <ListItem key={t.id} sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  De: <Box component="span" sx={{ color: 'primary.main', fontWeight: 'bold' }}>{t.fromUser.nombre}</Box> (ID: {t.fromUser.id})
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  Monto: <Box component="span" sx={{ color: 'success.dark', fontWeight: 'bold' }}>+${t.amount} {t.currency}</Box> - Fecha: {new Date(t.date).toLocaleString()}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
        No hay transacciones recibidas
      </Typography>
    )}

    {/* Display Balances if available and not empty */}
    {user.COD && Object.keys(user.COD).length > 0 && (
      <>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Balances
        </Typography>
        <Stack direction="row" spacing={3} sx={{ ml: 2, flexWrap: 'wrap' }}>
          {Object.entries(user.COD).map(([currency, amount]) => (
            <Typography key={currency} variant="body2" color="text.secondary">
              <Typography component="span" variant="body1" sx={{ fontWeight: 'bold', color: 'success.main' }}>{currency}:</Typography> {amount?.toFixed(2) ?? '0.00'}
            </Typography>
          ))}
        </Stack>
      </>
    )}
  </Box>
);


const Dashboard = () => {
  const [users, setUsers] = useState<Usuario[]>([]);
  const [userInfo, setUserInfo] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      if (!token) {
        setError("No autorizado. Por favor, inicia sesión.");
        setLoading(false);
        return;
      }

      try {
        // Fetch current user info
        const userResponse = await fetch(
          "https://proyectofinalutn-production.up.railway.app/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          throw new Error(errorData.message || "Error al obtener tus datos de usuario.");
        }
        const userData = await userResponse.json();
        setUserInfo(userData.user);

        // If user is admin, fetch all users
        if (userData.user.admin) {
          const usersResponse = await fetch(
            "https://proyectofinalutn-production.up.railway.app/admin/users",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!usersResponse.ok) {
            const errorData = await usersResponse.json();
            throw new Error(errorData.message || "Error al cargar los usuarios para el panel de administración.");
          }
          const usersData = await usersResponse.json();
          setUsers(usersData.users);
        } else {
          setError("Acceso denegado. No eres administrador.");
        }
      } catch (err) {
        console.error("Error al cargar el Dashboard:", err);
        setError(err instanceof Error ? err.message : "Ocurrió un error inesperado al cargar el panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]); // Depend on token to re-fetch if it changes

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete === null) return;

    try {
      const response = await fetch(
        `https://proyectofinalutn-production.up.railway.app/admin/users/${userToDelete}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar usuario.");
      }

      setUsers(users.filter((u) => u.id !== userToDelete));
      // Optionally show a success message
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setError(err instanceof Error ? err.message : "Error al eliminar usuario.");
    } finally {
      setConfirmOpen(false);
      setUserToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  const toggleExpand = (id: number) => {
    setExpandedUserId((prev) => (prev === id ? null : id));
  };

  // --- Render Logic for various states ---
  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column' }}>
          <CircularProgress size={60} color="primary" />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            Cargando Panel de Administración...
          </Typography>
        </Box>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', p: 3 }}>
          <Alert severity="error" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ maxWidth: 600, width: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>Error de Acceso o Carga</Typography>
            <Typography variant="body1">{error}</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Por favor, verifica tus permisos o intenta recargar la página.
            </Typography>
          </Alert>
        </Box>
      </>
    );
  }

  if (!userInfo || !userInfo.admin) {
    return (
      <>
        <Navbar />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', flexDirection: 'column', p: 3 }}>
          <Alert severity="warning" icon={<ErrorOutlineIcon fontSize="inherit" />} sx={{ maxWidth: 600, width: '100%' }}>
            <Typography variant="h6" component="h2" gutterBottom>Acceso No Autorizado</Typography>
            <Typography variant="body1">
              No tienes los permisos necesarios para acceder a este panel de administración.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => window.location.href = '/home'} // Or navigate to home page
            >
              Volver a la Página Principal
            </Button>
          </Alert>
        </Box>
      </>
    );
  }

  // --- Main Dashboard Content ---
  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 8 }}>
        <Typography variant="h3" component="h1" align="center" sx={{ mt: 4, mb: 5, fontWeight: 'bold', color: 'primary.main' }}>
          <DashboardIcon sx={{ fontSize: 40, verticalAlign: 'bottom', mr: 2 }} />
          Panel de Administración
        </Typography>

        <Paper elevation={6} sx={{ borderRadius: 3, overflow: 'hidden', mb: 4 }}>
          <TableContainer>
            <Table aria-label="admin users table">
              <TableHead sx={{ bgcolor: 'primary.dark' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Detalles de Usuario</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay usuarios registrados en el sistema.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <React.Fragment key={user.id}>
                      <TableRow
                        hover
                        onClick={() => toggleExpand(user.id)}
                        sx={{ '& > *': { borderBottom: 'unset' }, cursor: 'pointer' }}
                      >
                        <TableCell component="th" scope="row">
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton aria-label="expand row" size="small">
                              {expandedUserId === user.id ? (
                                <KeyboardArrowUpIcon />
                              ) : (
                                <KeyboardArrowDownIcon />
                              )}
                            </IconButton>
                            <AccountCircleIcon sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {user.nombre}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EmailIcon sx={{ mr: 1, color: 'action.active' }} />
                            <Typography variant="body1">{user.email}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="eliminar"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row expansion on delete click
                              handleDeleteClick(user.id);
                            }}
                            disabled={user.id === userInfo?.id} // Prevent deleting self
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                          <Collapse in={expandedUserId === user.id} timeout="auto" unmountOnExit>
                            <RowContent user={user} />
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Confirmation Dialog */}
        <Dialog
          open={confirmOpen}
          onClose={handleCancelDelete}
          aria-labelledby="confirm-delete-dialog-title"
          aria-describedby="confirm-delete-dialog-description"
        >
          <DialogTitle id="confirm-delete-dialog-title">{"Confirmar Eliminación de Usuario"}</DialogTitle>
          <DialogContent>
            <Typography variant="body1" id="confirm-delete-dialog-description">
              ¿Estás seguro de que deseas eliminar al usuario **{users.find(u => u.id === userToDelete)?.nombre || 'este usuario'}**? Esta acción no se puede deshacer.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancelDelete} variant="outlined" color="primary">
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} variant="contained" color="error" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Dashboard;