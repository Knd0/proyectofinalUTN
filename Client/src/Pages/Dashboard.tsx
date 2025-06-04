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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface User {
  id: number;
  nombre: string;
  email: string;
  admin?: boolean;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("https://proyectofinalutn-production.up.railway.app/auth/me", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Error al obtener los datos del usuario");

        const data = await response.json();
        setUserInfo(data.user);

        if (data.user.admin === true) fetchUsers();
      } catch (err) {
        setError("No se pudo cargar la información del usuario");
      } finally {
        setLoading(false);
      }
    };

    const fetchUsers = () => {
      fetch("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data))
        .catch((err) => console.error("Error al cargar usuarios:", err));
    };

    fetchUserData();
  }, []);

  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete === null) return;

    fetch(`/admin/users/${userToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al eliminar usuario");
        setUsers(users.filter((u) => u.id !== userToDelete));
      })
      .catch((err) => console.error(err))
      .finally(() => {
        setConfirmOpen(false);
        setUserToDelete(null);
      });
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
    setUserToDelete(null);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!userInfo || userInfo.admin !== true) return <Typography>No autorizado</Typography>;

  return (
    <>
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
              <TableRow key={user.id}>
                <TableCell>{user.nombre}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <IconButton
                    aria-label="eliminar"
                    color="error"
                    onClick={() => handleDeleteClick(user.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={confirmOpen} onClose={handleCancelDelete}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro que querés eliminar este usuario?
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
