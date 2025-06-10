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
  Grid,
  Chip, // For the verification alert
} from "@mui/material";

// Material-UI Icons
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import WarningAmberIcon from "@mui/icons-material/WarningAmber"; // For the alert

import { useUser, Balance } from "../Components/Context/UserContext";

type Currency = keyof Balance;

const Home = () => {
  const { userInfo, balance, fetchUserData } = useUser();
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>("USD");
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

  const handleCurrencyChange = (event: React.ChangeEvent<HTMLSelectElement> | { target: { value: unknown } }) => {
    setSelectedCurrency(event.target.value as Currency);
  };

  const currencyOptions = Object.keys(balance) as Currency[];

  if (!userInfo) return <Loader />;

  const isDisabled = !userInfo.isconfirmed;

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary", minHeight: "100vh" }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          maxWidth: { xs: '100%', sm: '600px', md: '960px', lg: '1280px' },
          mx: "auto",
          px: { xs: 2, sm: 3, md: 4 },
          py: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
        data-aos="fade-up"
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold", mb: 6, textAlign: "center", color: 'primary.main' }}>
          ¡Bienvenido, {userInfo.nombre}!
        </Typography>

        {/* Balance Card */}
        <Card
          sx={{
            width: "100%",
            maxWidth: 600,
            bgcolor: "primary.dark",
            color: "white",
            borderRadius: 3,
            boxShadow: 8,
            p: 4,
            mb: 6,
            transition: "transform 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-5px) scale(1.01)",
              boxShadow: 12,
            },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <CardContent sx={{ p: 0, '&:last-child': { pb: 0 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h3" sx={{ fontWeight: "medium", mb: 3, color: 'text.secondary' }}>
              Balance Actual
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Typography variant="h4" component="span" sx={{ fontWeight: "bold", color: "success.main" }}>
                $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="currency-select-label" sx={{ color: 'white' }}>Moneda</InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  label="Moneda"
                  sx={{
                    color: "white",
                    ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.3)" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "secondary.main" },
                    "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.6)" },
                    ".MuiSvgIcon-root": { color: "white" },
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

            {isDisabled && (
              <Chip
                icon={<WarningAmberIcon />}
                label="Verificá tu correo para activar estas funciones."
                color="warning"
                variant="filled"
                sx={{ mb: 3, fontSize: '0.9rem', py: 1.5, px: 1, height: 'auto' }}
              />
            )}

            <Button
              variant="contained"
              color="secondary"
              onClick={() => navigate("/exchange")}
              disabled={isDisabled}
              startIcon={<CurrencyExchangeIcon />}
              sx={{
                width: "100%",
                mt: isDisabled ? 1 : 0,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 6,
                },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
            >
              Convertir Moneda
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Grid container spacing={4} sx={{ width: "100%", maxWidth: 800, mb: 8 }}>
          {/* FIX: Add component="div" to Grid items */}
          <Grid component="div">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/loadbalance")}
              disabled={isDisabled}
              startIcon={<ArrowDownwardIcon />}
              sx={{
                width: "100%",
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
            >
              Ingresar Dinero
            </Button>
          </Grid>
          {/* FIX: Add component="div" to Grid items */}
          <Grid component="div">
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/transaction")}
              disabled={isDisabled}
              startIcon={<ArrowUpwardIcon />}
              sx={{
                width: "100%",
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: 4,
                '&:hover': {
                  boxShadow: 8,
                  transform: 'translateY(-2px)',
                },
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
              }}
            >
              Transferir Dinero
            </Button>
          </Grid>
        </Grid>

        {/* Transaction History */}
        <Box sx={{ width: "100%", maxWidth: 900 }} data-aos="fade-up" data-aos-delay="200">
          <TransactionHistory />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;