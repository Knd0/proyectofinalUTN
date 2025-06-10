import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/Navbar/Navbar";
import TransactionHistory from "../Components/Transaction/TransactionHistory";
import Loader from "../Components/Loader/loader";

// Material-UI Components
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  Chip,
  Divider,
  Tooltip,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";

// Material-UI Icons
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Balance
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange"; // Convertir
import AccountBalanceIcon from "@mui/icons-material/AccountBalance"; // Ingresar dinero
import SendIcon from "@mui/icons-material/Send"; // Transferir dinero
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // Alerta verificación
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icono copiar CVU
import VpnKeyIcon from "@mui/icons-material/VpnKey"; // Icono CVU

import { useUser, Balance } from "../Components/Context/UserContext";

type Currency = keyof Balance;

const Home = () => {
  const { userInfo, balance, fetchUserData } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [navigate, fetchUserData]);

  const handleCurrencyChange = (
    event: React.ChangeEvent<HTMLSelectElement> | { target: { value: unknown } }
  ) => {
    setSelectedCurrency(event.target.value as Currency);
  };

  const currencyOptions = balance ? (Object.keys(balance) as Currency[]) : [];

  if (!userInfo) return <Loader />;

  const isDisabled = !userInfo.isconfirmed;

  const handleCopyCVU = () => {
    if (userInfo.cvu) {
      navigator.clipboard.writeText(userInfo.cvu);
      setCopySuccess(true);
    }
  };

  const handleCloseSnackbar = () => {
    setCopySuccess(false);
  };

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          maxWidth: { xs: "100%", sm: "600px", md: "960px", lg: "1280px" },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        data-aos="fade-up"
      >
        <Typography
          variant="h3"
          component="h1"
          sx={{ fontWeight: "bold", mb: 6, textAlign: "center", color: "primary.main" }}
        >
          ¡Bienvenido, {userInfo.nombre}!
        </Typography>

        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "background.paper",
            color: "text.primary",
            borderRadius: 3,
            boxShadow: 8,
            p: 4,
            mb: 6,
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px) scale(1.01)",
              boxShadow: 12,
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <CardContent
            sx={{
              p: 0,
              "&:last-child": { pb: 0 },
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 48, mb: 2, color: "primary.main" }} />
            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: "medium", mb: 1, color: "text.secondary" }}
            >
              Balance Actual
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 3 }}>
              <Typography variant="h4" component="span" sx={{ fontWeight: "bold", color: "success.main" }}>
                $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="currency-select-label" sx={{ color: "text.secondary" }}>
                  Moneda
                </InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  label="Moneda"
                  sx={{
                    color: "text.primary",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: "divider" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "primary.main" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "text.secondary" },
                    ".MuiSvgIcon-root": { color: "text.secondary" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "background.paper",
                        color: "text.primary",
                        border: "1px solid",
                        borderColor: "divider",
                      },
                    },
                  }}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency} value={currency} sx={{ "&:hover": { bgcolor: "action.hover" } }}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {isDisabled && (
              <Chip
                icon={<WarningAmberIcon />}
                label="Verifica tu correo para activar todas las funciones."
                color="warning"
                variant="filled"
                sx={{ mb: 3, fontSize: "0.9rem", py: 1.5, px: 1, height: "auto", fontWeight: "medium" }}
              />
            )}

            {/* CVU Display */}
            <Divider sx={{ width: "100%", my: 2 }} />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                width: "100%",
                flexWrap: "wrap",
              }}
            >
              <VpnKeyIcon color="primary" />
              <Typography
                variant="body1"
                sx={{
                  wordBreak: "break-all",
                  fontWeight: "medium",
                  userSelect: "text",
                  flexGrow: 1,
                  textAlign: "center",
                }}
                title="Tu CVU"
              >
                {userInfo.cvu ?? "No disponible"}
              </Typography>
              <Tooltip title="Copiar CVU">
                <IconButton
                  color="primary"
                  onClick={handleCopyCVU}
                  disabled={!userInfo.cvu}
                  aria-label="copiar CVU"
                >
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </CardContent>
        </Card>

        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 3,
            mb: 8,
            borderRadius: 3,
            bgcolor: "background.paper",
            boxShadow: 8,
            border: "1px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-around",
            alignItems: "center",
            gap: { xs: 2, sm: 3 },
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/loadbalance")}
            disabled={isDisabled}
            startIcon={<AccountBalanceIcon />}
            sx={{
              flexGrow: 1,
              py: 1.8,
              borderRadius: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: "bold",
              boxShadow: 4,
              "&:hover": {
                boxShadow: 8,
                transform: "translateY(-2px)",
              },
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            }}
          >
            Ingresar
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/transaction")}
            disabled={isDisabled}
            startIcon={<SendIcon />}
            sx={{
              flexGrow: 1,
              py: 1.8,
              borderRadius: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: "bold",
              boxShadow: 4,
              "&:hover": {
                boxShadow: 8,
                transform: "translateY(-2px)",
              },
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            }}
          >
            Transferir
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/exchange")}
            disabled={isDisabled}
            startIcon={<CurrencyExchangeIcon />}
            sx={{
              flexGrow: 1,
              py: 1.8,
              borderRadius: 2,
              fontSize: { xs: "0.9rem", sm: "1rem" },
              fontWeight: "bold",
              boxShadow: 4,
              "&:hover": {
                boxShadow: 8,
                transform: "translateY(-2px)",
              },
              transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
            }}
          >
            Convertir
          </Button>
        </Paper>

        <Box sx={{ width: "100%", maxWidth: 900 }} data-aos="fade-up" data-aos-delay="200">
          <TransactionHistory />
        </Box>

        {/* Snackbar para confirmar copia */}
        <Snackbar
          open={copySuccess}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }} onClose={handleCloseSnackbar}>
            CVU copiado al portapapeles!
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Home;
