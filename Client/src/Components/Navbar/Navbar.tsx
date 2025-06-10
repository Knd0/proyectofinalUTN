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
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Alert,
  Collapse,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from "@mui/icons-material/Home";

interface UserInfo {
  nombre: string;
  admin: boolean;
  isconfirmed: boolean;
  perfil: {
    imagen: string;
  };
}

const Navbar: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

        if (!response.ok) throw new Error("No se pudo obtener el usuario");

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

  if (!userInfo) return null;

  const drawer = (
    <Box
      onClick={toggleDrawer}
      sx={{
        width: 250,
        bgcolor: "#1f2937",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        py: 3,
        gap: 1,
      }}
    >
      <List sx={{ flexGrow: 1, px: 1 }}>
        <ListItemButton component={Link} to="/home" sx={{ color: "white", py: 1.5 }}>
          <ListItemIcon sx={{ color: "white" }}><HomeIcon /></ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>
        {userInfo.admin && (
          <ListItemButton component={Link} to="/admin" sx={{ color: "white", py: 1.5 }}>
            <ListItemIcon sx={{ color: "white" }}><AdminPanelSettingsIcon /></ListItemIcon>
            <ListItemText primary="Panel de Administración" />
          </ListItemButton>
        )}
        <ListItemButton component={Link} to="/profile" sx={{ color: "white", py: 1.5 }}>
          <ListItemIcon sx={{ color: "white" }}><AccountCircleIcon /></ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton onClick={handleLogout} sx={{ color: "#ef4444", py: 1.5 }}>
          <ListItemIcon sx={{ color: "#ef4444" }}><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="static"
        sx={{
          bgcolor: "#111827",
          boxShadow: "0 4px 12px rgba(0,0,0,0.8)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <Toolbar
          sx={{
            maxWidth: "1280px",
            width: "100%",
            mx: "auto",
            px: { xs: 2, sm: 3, md: 4 },
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 1 }}
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: 1,
              cursor: "pointer",
              "&:hover": { opacity: 0.8 },
              transition: "opacity 0.3s ease-in-out",
            }}
            onClick={() => navigate("/home")}
          >
            <Typography
              variant="h5"
              component="div"
              sx={{
                color: "#3b82f6",
                fontWeight: "bold",
                letterSpacing: 1.5,
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
                userSelect: "none",
              }}
            >
              Wamoney
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 3,
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
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderColor: "#3b82f6",
                  },
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: "bold",
                  py: 1,
                  px: 2,
                }}
                startIcon={<AdminPanelSettingsIcon />}
              >
                Admin Panel
              </Button>
            )}
            <Tooltip title={userInfo.nombre} arrow>
              <Avatar
                alt={userInfo.nombre}
                src={userInfo.perfil.imagen}
                sx={{
                  width: 44,
                  height: 44,
                  border: "2px solid #3b82f6",
                  cursor: "pointer",
                  transition: "border-color 0.3s ease-in-out",
                  "&:hover": { borderColor: "white" },
                }}
                onClick={() => navigate("/profile")}
              />
            </Tooltip>

            <Button
              onClick={handleLogout}
              variant="outlined"
              sx={{
                color: "#ef4444",
                borderColor: "#ef4444",
                "&:hover": {
                  bgcolor: "rgba(239,68,68,0.1)",
                  borderColor: "#ef4444",
                },
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
                px: 2,
                py: 1,
              }}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {!userInfo.isconfirmed && showVerificationAlert && (
        <Collapse in={showVerificationAlert}>
          <Alert
            severity="warning"
            variant="filled"
            sx={{
              position: "sticky",
              top: 0,
              width: "100%",
              zIndex: 1300,
              bgcolor: "#facc15",
              color: "#1f2937",
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              borderRadius: 0,
              textAlign: "center",
              py: 2,
              ".MuiAlert-icon": { mr: 1 },
              ".MuiAlert-action": { mr: 1 },
            }}
            action={
              <IconButton
                aria-label="cerrar"
                color="inherit"
                size="small"
                onClick={() => setShowVerificationAlert(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            Verificá tu correo para activar todas las funciones de Wamoney.
            <Button
              size="small"
              onClick={() => {
                // Lógica para reenviar correo
              }}
              sx={{
                ml: 2,
                px: 1,
                py: 0.5,
                fontWeight: "bold",
                color: "#1f2937",
                textDecoration: "underline",
                "&:hover": {
                  textDecoration: "none",
                  bgcolor: "transparent",
                  color: "#111827",
                },
              }}
            >
              Reenviar correo
            </Button>
          </Alert>
        </Collapse>
      )}

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
            borderRight: "1px solid rgba(255,255,255,0.05)",
          },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
