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
import HomeIcon from "@mui/icons-material/Home";
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
    return null; // o loader si querés
  }

  const drawer = (
    <Box onClick={toggleDrawer} sx={{ width: 250 }}>
      <List>
        <ListItem component={Link} to="/home">
          <HomeIcon sx={{ mr: 1 }} />
          <ListItemText primary="Inicio" />
        </ListItem>
        {userInfo.admin && (
          <ListItem component={Link} to="/admin">
            <AdminPanelSettingsIcon sx={{ mr: 1 }} />
            <ListItemText primary="Admin" />
          </ListItem>
        )}

        <ListItem component={Link} to="/profile">
          <AccountCircleIcon sx={{ mr: 1 }} />
          <ListItemText primary="Mi Perfil" />
        </ListItem>
        <ListItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1, color: "red" }} />
          <ListItemText primary="Cerrar sesión" sx={{ color: "red" }} />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        color="default"
        sx={{ boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}
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
            <HomeIcon color="primary" sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              component="div"
              color="primary"
              fontWeight="bold"
            >
              Mi Billetera
            </Typography>
          </Box>

          {/* Desktop menu */}
          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 3,
            }}
          >
            <Button
              component={Link}
              to="/home"
              color="primary"
              variant="outlined"
              startIcon={<HomeIcon />}
            >
              Inicio
            </Button>

            {userInfo.admin && (
              <Button
                component={Link}
                to="/admin"
                color="secondary"
                variant="outlined"
                startIcon={<AdminPanelSettingsIcon />}
              >
                Admin
              </Button>
            )}

            <Button
              component={Link}
              to="/profile"
              variant="text"
              startIcon={<AccountCircleIcon />}
            >
              Mi Perfil
            </Button>

            <Button
              onClick={handleLogout}
              color="error"
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>

            <Tooltip title={userInfo.nombre} arrow>
              <Avatar
                alt={userInfo.nombre}
                src={userInfo.perfil.imagen}
                sx={{ ml: 2, width: 40, height: 40 }}
              />
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
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 250 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
