import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Chip,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  role: string;
  status: string;
  avatarSrc?: string;
  transactions?: Transaction[];
}

interface Transaction {
  id: number;
  amount: number;
  description: string;
  date: string;
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [expandedUserIds, setExpandedUserIds] = useState<number[]>([]);

  useEffect(() => {
    // Aquí deberías llamar a tu backend para traer los usuarios con transacciones
    fetch("/admin/users", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      });
  }, []);

  const toggleExpand = (userId: number) => {
    setExpandedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Seguro que querés eliminar este usuario?")) return;

    fetch(`/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      if (res.ok) {
        setUsers(users.filter((user) => user.id !== id));
      }
    });
  };

  const handleEdit = (id: number) => {
    // Aquí podés implementar un modal o inline editing
    alert(`Editar usuario con id: ${id}`);
  };

  return (
    <Card sx={{ padding: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar src={user.avatarSrc} />
                      <Box>
                        <Typography fontWeight="medium">{user.nombre}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user.username}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.status === "active" ? "Activo" : "Inactivo"}
                      color={user.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(user.id)} color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => toggleExpand(user.id)}>
                      {expandedUserIds.includes(user.id) ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>

                {/* Fila expandida con detalles */}
                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedUserIds.includes(user.id)} timeout="auto" unmountOnExit>
                      <Box margin={2}>
                        <Typography variant="subtitle1" gutterBottom>
                          Transacciones de {user.nombre}
                        </Typography>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>ID</TableCell>
                              <TableCell>Monto</TableCell>
                              <TableCell>Descripción</TableCell>
                              <TableCell>Fecha</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {user.transactions && user.transactions.length > 0 ? (
                              user.transactions.map((tx) => (
                                <TableRow key={tx.id}>
                                  <TableCell>{tx.id}</TableCell>
                                  <TableCell>{tx.amount}</TableCell>
                                  <TableCell>{tx.description}</TableCell>
                                  <TableCell>{new Date(tx.date).toLocaleDateString()}</TableCell>
                                </TableRow>
                              ))
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align="center">
                                  No hay transacciones.
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default Dashboard;
