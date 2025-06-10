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
  ListItemButton, // Changed from ListItem for better click feedback
  ListItemIcon,
  ListItemText,
  Box,
  Button,
  Alert,
  Collapse,
  useMediaQuery, // Hook for media queries
  useTheme, // Hook to access the theme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import HomeIcon from '@mui/icons-material/Home'; // Added Home icon for navigation

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
  const theme = useTheme(); // Access the default theme
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen size is 'sm' or smaller

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

  if (!userInfo) return null;

  const drawer = (
    <Box
      onClick={toggleDrawer}
      sx={{
        width: 250,
        bgcolor: "#1f2937", // Darker background for consistency
        height: "100%",
        display: "flex",
        flexDirection: "column",
        py: 2, // Padding top/bottom
      }}
    >
      <List sx={{ flexGrow: 1 }}>
        <ListItemButton component={Link} to="/home" sx={{ color: "white" }}>
          <ListItemIcon sx={{ color: "white" }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Inicio" />
        </ListItemButton>
        {userInfo.admin && (
          <ListItemButton component={Link} to="/admin" sx={{ color: "white" }}>
            <ListItemIcon sx={{ color: "white" }}>
              <AdminPanelSettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Panel de Administración" />
          </ListItemButton>
        )}
        <ListItemButton component={Link} to="/profile" sx={{ color: "white" }}>
          <ListItemIcon sx={{ color: "white" }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Mi Perfil" />
        </ListItemButton>
      </List>
      <List>
        <ListItemButton onClick={handleLogout} sx={{ color: "#ef4444" }}> {/* Tailwind red-500 */}
          <ListItemIcon sx={{ color: "#ef4444" }}>
            <LogoutIcon />
          </ListItemIcon>
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
          bgcolor: "#111827", // Even darker, nearly black for a sleeker look
          boxShadow: "0 4px 12px rgba(0,0,0,0.8)", // More pronounced shadow
          borderBottom: "1px solid rgba(255,255,255,0.05)", // Subtle bottom border
        }}
      >
        <Toolbar sx={{ maxWidth: "1280px", width: "100%", mx: "auto", px: { xs: 2, sm: 3, md: 4 } }}> {/* Adjusted max-width and padding */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={toggleDrawer}
              sx={{ mr: 1 }} // Reduced margin for mobile
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
              "&:hover": { opacity: 0.8 }, // Subtle hover effect for logo
              transition: "opacity 0.3s ease-in-out",
            }}
            onClick={() => navigate("/home")}
          >
            {/* Using a custom icon or a logo component would be ideal here */}
            <Typography
              variant="h5" // Slightly larger for better branding
              component="div"
              sx={{ color: "#3b82f6", fontWeight: "bold", letterSpacing: 1.5 }} // Primary brand color and spacing
            >
              Wamoney
            </Typography>
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              gap: 3, // Increased gap for more spacing
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
                    backgroundColor: "rgba(59, 130, 246, 0.1)", // Lighter hover background
                    borderColor: "#3b82f6",
                    color: "#3b82f6",
                  },
                  borderRadius: 2, // Slightly rounded corners
                  textTransform: 'none', // Prevent uppercase
                  fontWeight: 'bold',
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
                  width: 44, // Slightly larger avatar
                  height: 44,
                  border: "2px solid #3b82f6", // Add a subtle border
                  cursor: "pointer",
                  transition: "border-color 0.3s ease-in-out",
                  "&:hover": { borderColor: "white" }, // Border color changes on hover
                }}
                onClick={() => navigate("/profile")} // Make avatar clickable to profile
              />
            </Tooltip>

            <Button
              onClick={handleLogout}
              variant="contained" // Use contained for primary actions like logout
              sx={{
                bgcolor: "#ef4444", // Tailwind red-500
                "&:hover": { bgcolor: "#dc2626" }, // Darker red on hover
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                py: 1,
                px: 2,
              }}
              startIcon={<LogoutIcon />}
            >
              Cerrar sesión
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Verification Alert */}
      {!userInfo.isconfirmed && showVerificationAlert && (
        <Collapse in={showVerificationAlert}>
          <Alert
            severity="warning"
            variant="filled"
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
            sx={{
              position: "sticky", // Changed from fixed to sticky for better flow
              top: 0, // Sticks right below the AppBar
              width: "100%",
              zIndex: 1300, // Z-index slightly less than AppBar for proper layering
              bgcolor: "#facc15", // Tailwind yellow-400
              color: "#1f2937", // Dark text for contrast
              fontWeight: "bold",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              borderRadius: 0, // Remove border radius for full-width alert
              textAlign: "center",
              py: 1.5, // Adjusted vertical padding
              ".MuiAlert-icon": { mr: 1 }, // Spacing for icon
              ".MuiAlert-action": { mr: 1 }, // Spacing for close button
            }}
          >
            Verificá tu correo para activar todas las funciones de Wamoney.
            <Button
              size="small"
              sx={{
                ml: 2,
                color: '#1f2937', // Darker text for the button
                textDecoration: 'underline',
                '&:hover': {
                    backgroundColor: 'transparent',
                    textDecoration: 'none'
                }
              }}
              onClick={() => { /* Implement resend verification email logic here */ }}
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
            bgcolor: "#1f2937", // Darker background for consistency
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