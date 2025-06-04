import { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import tableStyles from "@core/styles/table.module.css";
import classnames from "classnames";

interface User {
  id: number;
  nombre: string;
  username: string;
  email: string;
  imagen: string;
  admin: boolean;
  sentTransactions: any[];
  receivedTransactions: any[];
}

const Dashboard = () => {
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editedUserData, setEditedUserData] = useState<Partial<User>>({});

  const token = localStorage.getItem("token"); // O donde lo tengas guardado

  const fetchUsers = async () => {
    const res = await axios.get(
      "https://proyectofinalutn-production.up.railway.app/admin/users",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setUsers(res.data.users);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEditClick = (user: any) => {
    setEditingUserId(user.id);
    setEditedUserData(user);
  };

  const handleSave = async () => {
    await axios.put(
      `https://proyectofinalutn-production.up.railway.app/admin/users/${editingUserId}`,
      editedUserData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setEditingUserId(null);
    fetchUsers();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(
      `https://proyectofinalutn-production.up.railway.app/admin/users/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    fetchUsers();
  };

  const handleChange = (field: string, value: any) => {
    setEditedUserData((prev: any) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Status</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((row) => {
              const isEditing = editingUserId === row.id;
              return (
                <tr key={row.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <Avatar src={row.imagen} sx={{ width: 34, height: 34 }} />
                      <div className="flex flex-col">
                        {isEditing ? (
                          <>
                            <TextField
                              size="small"
                              value={editedUserData.nombre}
                              onChange={(e) =>
                                handleChange("nombre", e.target.value)
                              }
                            />
                            <TextField
                              size="small"
                              value={editedUserData.username}
                              onChange={(e) =>
                                handleChange("username", e.target.value)
                              }
                            />
                          </>
                        ) : (
                          <>
                            <Typography className="font-medium">
                              {row.nombre}
                            </Typography>
                            <Typography variant="body2">
                              {row.username}
                            </Typography>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {isEditing ? (
                      <TextField
                        size="small"
                        value={editedUserData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                      />
                    ) : (
                      <Typography>{row.email}</Typography>
                    )}
                  </td>
                  <td>
                    <Typography>{row.admin ? "Admin" : "Usuario"}</Typography>
                  </td>
                  <td>
                    <Chip label="Activo" variant="filled" color="success" />
                  </td>
                  <td>
                    {isEditing ? (
                      <IconButton onClick={handleSave}>
                        <SaveIcon />
                      </IconButton>
                    ) : (
                      <IconButton onClick={() => handleEditClick(row)}>
                        <EditIcon />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleDelete(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => toggleExpand(row.id)}>
                      <ExpandMoreIcon
                        style={{
                          transform: expandedRows.includes(row.id)
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                        }}
                      />
                    </IconButton>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {users.map((row) => (
          <Collapse
            in={expandedRows.includes(row.id)}
            timeout="auto"
            unmountOnExit
            key={`detail-${row.id}`}
          >
            <div className="p-4 border-t border-gray-200">
              <Typography variant="h6">Movimientos de {row.nombre}</Typography>
              {row.sentTransactions.length === 0 &&
              row.receivedTransactions.length === 0 ? (
                <Typography>No hay movimientos</Typography>
              ) : (
                <ul className="mt-2">
                  {row.sentTransactions.map((tx: any) => (
                    <li key={`sent-${tx.id}`}>
                      Enviado → CVU: {tx.destinatarioCVU} | Monto: {tx.monto}{" "}
                      {tx.moneda}
                    </li>
                  ))}
                  {row.receivedTransactions.map((tx: any) => (
                    <li key={`rec-${tx.id}`}>
                      Recibido ← CVU: {tx.remitenteCVU} | Monto: {tx.monto}{" "}
                      {tx.moneda}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Collapse>
        ))}
      </div>
    </Card>
  );
};

export default Dashboard;
