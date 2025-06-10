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
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";

// Material-UI Icons
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useUser, Balance } from "../Components/Context/UserContext";

type Currency = keyof Balance;

const Home = () => {
  const { userInfo, balance, fetchUserData } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
  const [copied, setCopied] = useState(false);
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

  const handleCopyCVU = () => {
    if (userInfo?.cvu) {
      navigator.clipboard.writeText(userInfo.cvu);
      setCopied(true);
    }
  };

  const handleCloseSnackbar = () => {
    setCopied(false);
  };

  const currencyOptions = balance ? (Object.keys(balance) as Currency[]) : [];

  if (!userInfo) return <Loader />;

  const isDisabled = !userInfo.isconfirmed;

  return (
    <Box sx={{ bgcolor: "#121212", color: "#e0e0e0", minHeight: "100vh" }}>
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
          sx={{ fontWeight: "bold", mb: 6, textAlign: "center", color: "#90caf9" }}
        >
          ¡Bienvenido, {userInfo.nombre}!
        </Typography>

        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "#1e1e1e",
            color: "#e0e0e0",
            borderRadius: 3,
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            p: 4,
            mb: 6,
            transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px) scale(1.01)",
              boxShadow: "0 8px 25px rgba(0,0,0,0.7)",
            },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
            border: "1px solid",
            borderColor: "#333",
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
            }}
          >
            <AccountBalanceWalletIcon sx={{ fontSize: 48, mb: 2, color: "#90caf9" }} />
            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: "medium", mb: 1, color: "#b0bec5" }}
            >
              Balance Actual
            </Typography>

            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 1 }}>
              <Typography
                variant="h4"
                component="span"
                sx={{ fontWeight: "bold", color: "#81c784" }}
              >
                $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="currency-select-label" sx={{ color: "#b0bec5" }}>
                  Moneda
                </InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  label="Moneda"
                  sx={{
                    color: "#e0e0e0",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: "#333" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#90caf9",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#b0bec5",
                    },
                    ".MuiSvgIcon-root": { color: "#b0bec5" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1e1e1e",
                        color: "#e0e0e0",
                        border: "1px solid",
                        borderColor: "#333",
                      },
                    },
                  }}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem
                      key={currency}
                      value={currency}
                      sx={{ "&:hover": { bgcolor: "#333" } }}
                    >
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* CVU with copy */}
            <Box
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#333",
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  color: "#b0bec5",
                  fontWeight: 500,
                  fontSize: "0.9rem",
                  wordBreak: "break-all",
                }}
              >
                CVU: {userInfo.cvu}
              </Typography>
              <Tooltip title="Copiar CVU">
                <IconButton onClick={handleCopyCVU} size="small" sx={{ color: "#b0bec5" }}>
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            {isDisabled && (
              <Chip
                icon={<WarningAmberIcon />}
                label="Verifica tu correo para activar todas las funciones."
                color="warning"
                variant="filled"
                sx={{
                  mt: 3,
                  fontSize: "0.9rem",
                  py: 1.5,
                  px: 1,
                  height: "auto",
                  fontWeight: "medium",
                }}
              />
            )}
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 3,
            mb: 8,
            borderRadius: 3,
            bgcolor: "#1e1e1e",
            boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
            border: "1px solid",
            borderColor: "#333",
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
        </Paper>

        {/* Historial de transacciones */}
        <Box sx={{ width: "100%", maxWidth: 900 }} data-aos="fade-up" data-aos-delay="200">
          <TransactionHistory />
        </Box>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        message="CVU copiado al portapapeles"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
};

export default Home;
