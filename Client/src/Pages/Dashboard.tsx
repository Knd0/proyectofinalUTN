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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Navbar from "Components/Navbar/Navbar";

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
  COD: { [key: string]: number };
  sentTransactions: Transaction[];
  receivedTransactions: Transaction[];
}

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
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://proyectofinalutn-production.up.railway.app/auth/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!response.ok)
          throw new Error("Error al obtener los datos del usuario");

        const data = await response.json();
        setUserInfo(data.user);

        if (data.user.admin === true) fetchUsers();
      } catch (err) {
        setError("No se pudo cargar la información del usuario");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://proyectofinalutn-production.up.railway.app/admin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setUsers(data.users);
      } catch (err) {
        console.error("Error al cargar usuarios:", err);
        setError("Error al cargar los usuarios");
      }
    };

    fetchUserData();
  }, []);

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

      if (!response.ok) throw new Error("Error al eliminar usuario");

      setUsers(users.filter((u) => u.id !== userToDelete));
    } catch (err) {
      console.error(err);
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

  if (loading) return <CircularProgress sx={{ mt: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!userInfo || !userInfo.admin)
    return <Typography>No autorizado</Typography>;

  return (
    <>
      <Navbar />
      <Typography variant="h4" align="center" mt={2} mb={3}>
        Panel de Administración
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <TableRow
                  hover
                  onClick={() => toggleExpand(user.id)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>
                    {expandedUserId === user.id ? (
                      <KeyboardArrowUpIcon fontSize="small" />
                    ) : (
                      <KeyboardArrowDownIcon fontSize="small" />
                    )}{" "}
                    {user.nombre}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="eliminar"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(user.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell colSpan={3} sx={{ paddingBottom: 0, paddingTop: 0 }}>
                    <Collapse in={expandedUserId === user.id} timeout="auto" unmountOnExit>
                      <Typography variant="subtitle1" mt={2}>
                        📤 Enviadas:
                      </Typography>
                      {user.sentTransactions?.length ? (
                        <ul>
                          {user.sentTransactions.map((t) => (
                            <li key={t.id}>
                              A {t.toUser.nombre} (ID {t.toUser.id}) - ${t.amount}{" "}
                              {t.currency} - {new Date(t.date).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2">
                          No hay transacciones enviadas
                        </Typography>
                      )}

                      <Typography variant="subtitle1" mt={2}>
                        📥 Recibidas:
                      </Typography>
                      {user.receivedTransactions?.length ? (
                        <ul>
                          {user.receivedTransactions.map((t) => (
                            <li key={t.id}>
                              De {t.fromUser.nombre} (ID {t.fromUser.id}) - ${t.amount}{" "}
                              {t.currency} - {new Date(t.date).toLocaleString()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <Typography variant="body2">
                          No hay transacciones recibidas
                        </Typography>
                      )}
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>
            ¿Estás seguro de que deseas eliminar este usuario?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Dashboard;
