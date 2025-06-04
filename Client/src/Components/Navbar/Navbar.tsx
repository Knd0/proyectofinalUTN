import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

interface UserInfo {
  nombre: string;
  admin: boolean;
  perfil: {
    imagen: string;
  };
}

const Navbar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch(
          "https://proyectofinalutn-production.up.railway.app/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("No se pudo obtener el usuario");
        }

        const data = await response.json();
        setUserInfo(data.user);
      } catch (error) {
        console.error("Error al cargar usuario:", error);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  if (!userInfo) {
    return null;
  }

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ width: 250, bgcolor: "#1f2937", height: "100%" }}>
      <List>
        {userInfo.admin && (
          <ListItem component={Link} to="/admin" sx={{ color: "white" }}>
            <AdminPanelSettingsIcon sx={{ mr: 1 }} />
            <ListItemText primary="Admin" />
          </ListItem>
        )}

        <ListItem component={Link} to="/profile" sx={{ color: "white" }}>
          <AccountCircleIcon sx={{ mr: 1 }} />
          <ListItemText primary="Mi Perfil" />
        </ListItem>
        <ListItem onClick={handleLogout} sx={{ color: "red" }}>
          <LogoutIcon sx={{ mr: 1 }} />
          <ListItemText primary="Cerrar sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#1f2937", // gris oscuro similar bg-gray-800
          boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
        }}
      >
        <Toolbar className="max-w-6xl mx-auto w-full px-4">
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { sm: "none" } }}
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>

          {/* Logo / Nombre */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
            }}
            onClick={() => navigate("/home")}
          >
            {/* Home icon blanco */}
            <AdminPanelSettingsIcon
              sx={{ mr: 1, color: "#3b82f6" }} // azul intenso
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Wamoney
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            {userInfo.admin && (
              <Button
                component={Link}
                to="/admin"
                variant="outlined"
                sx={{
                  color: "#3b82f6",
                  borderColor: "#3b82f6",
                  "&:hover": {
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb",
                    color: "white",
                  },
                }}
                startIcon={<AdminPanelSettingsIcon />}
              >
                Admin
              </Button>
            )}

            <Button
              component={Link}
              to="/profile"
              variant="text"
              sx={{ color: "white" }}
              startIcon={<AccountCircleIcon />}
            >
              Mi Perfil
            </Button>

            <Button
              onClick={handleLogout}
              sx={{
                color: "white",
                bgcolor: "#dc2626",
                "&:hover": { bgcolor: "#b91c1c" },
              }}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>

            <Tooltip title={userInfo.nombre} arrow>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  ml: 2,
                  gap: 1,
                  color: "white",
                }}
              >
                <Avatar
                  alt={userInfo.nombre}
                  src={userInfo.perfil.imagen}
                  sx={{ width: 40, height: 40 }}
                />
                <Typography variant="body1">{userInfo.nombre}</Typography>
              </Box>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 250,
            bgcolor: "#1f2937",
            color: "white",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
