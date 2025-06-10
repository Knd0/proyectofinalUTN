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
  Chip,
  Paper,
  IconButton,
  Tooltip,
} from "@mui/material";

// Material-UI Icons
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy"; // Icon to copy CVU

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

  const handleCurrencyChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCurrency(event.target.value as Currency);
  };

  const handleCopyCVU = () => {
    if (userInfo?.cvu) {
      navigator.clipboard.writeText(userInfo.cvu);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currencyOptions = balance ? (Object.keys(balance) as Currency[]) : [];

  if (!userInfo) return <Loader />;

  const isDisabled = !userInfo.isconfirmed;

  return (
    <Box sx={{ bgcolor: "#121212", color: "#fff", minHeight: "100vh" }}>
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
          sx={{
            fontWeight: "bold",
            mb: 6,
            textAlign: "center",
            color: "primary.main",
          }}
        >
          ¡Bienvenido, {userInfo.nombre}!
        </Typography>

        {/* Balance Card */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "#1e1e1e",
            color: "#fff",
            borderRadius: 3,
            boxShadow: 8,
            p: 4,
            mb: 6,
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
            <AccountBalanceWalletIcon
              sx={{ fontSize: 48, mb: 2, color: "primary.main" }}
            />
            <Typography
              variant="h5"
              component="h3"
              sx={{ fontWeight: "medium", mb: 1, color: "gray" }}
            >
              Balance Actual
            </Typography>
            <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 3 }}>
              <Typography
                variant="h4"
                component="span"
                sx={{ fontWeight: "bold", color: "success.main" }}
              >
                $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="currency-select-label" sx={{ color: "#ccc" }}>
                  Moneda
                </InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  label="Moneda"
                  sx={{
                    color: "#fff",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: "#444" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "primary.main",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#888",
                    },
                    ".MuiSvgIcon-root": { color: "#ccc" },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        bgcolor: "#1e1e1e",
                        color: "#fff",
                        border: "1px solid #444",
                      },
                    },
                  }}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* CVU Display */}
            <Box
              sx={{
                bgcolor: "#2c2c2c",
                px: 2,
                py: 1,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "0.95rem", wordBreak: "break-all" }}
              >
                CVU: {userInfo.cvu}
              </Typography>
              <Tooltip title={copied ? "¡Copiado!" : "Copiar CVU"}>
                <IconButton onClick={handleCopyCVU} sx={{ color: "#ccc", p: 0.5 }}>
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
                sx={{ mt: 3, fontSize: "0.9rem", py: 1.5, fontWeight: "medium" }}
              />
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: 600,
            p: 3,
            mb: 8,
            borderRadius: 3,
            bgcolor: "#1e1e1e",
            boxShadow: 8,
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

        {/* Transaction History */}
        <Box sx={{ width: "100%", maxWidth: 900 }} data-aos="fade-up" data-aos-delay="200">
          <TransactionHistory />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
