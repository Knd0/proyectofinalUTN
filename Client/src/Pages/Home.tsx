import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../Components/Navbar/Navbar";
import TransactionHistory from "../Components/Transaction/TransactionHistory";
import Loader from "../Components/Loader/loader";

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

import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import SendIcon from "@mui/icons-material/Send";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { useUser, Balance } from "../Components/Context/UserContext";

import styles from "./Home.module.css";

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
    <Box className={styles.container}>
      <Navbar />
      <Box component="main" className={styles.main} data-aos="fade-up">
        <Typography variant="h3" component="h1" className={styles.title}>
          ¡Bienvenido, {userInfo.nombre}!
        </Typography>

        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <AccountBalanceWalletIcon className={styles.walletIcon} />
            <Typography variant="h5" component="h3" className={styles.subtitle}>
              Balance Actual
            </Typography>

            <Box className={styles.balanceRow}>
              <Typography variant="h4" component="span" className={styles.balance}>
                $ {balance[selectedCurrency]?.toFixed(2) ?? "0.00"}
              </Typography>
              <FormControl
                variant="outlined"
                size="small"
                className={styles.selectFormControl}
                color="primary"
              >
                <InputLabel id="currency-select-label" className={styles.selectLabel}>
                  Moneda
                </InputLabel>
                <Select
                  labelId="currency-select-label"
                  value={selectedCurrency}
                  onChange={handleCurrencyChange}
                  label="Moneda"
                  className={styles.select}
                  MenuProps={{
                    PaperProps: {
                      className: styles.selectMenuPaper,
                    },
                  }}
                >
                  {currencyOptions.map((currency) => (
                    <MenuItem
                      key={currency}
                      value={currency}
                      className={styles.selectMenuItem}
                    >
                      {currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box className={styles.cvuBox}>
              <Typography variant="body2" className={styles.cvuText}>
                CVU: {userInfo.cvu}
              </Typography>
              <Tooltip title="Copiar CVU">
                <IconButton onClick={handleCopyCVU} size="small" className={styles.copyButton}>
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
                className={styles.chipWarning}
              />
            )}
          </CardContent>
        </Card>

        <Paper elevation={6} className={styles.actionButtons}>
          <Button
            variant="contained"
            onClick={() => navigate("/loadbalance")}
            disabled={isDisabled}
            startIcon={<AccountBalanceIcon />}
            className={styles.actionButton}
          >
            Ingresar
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/transaction")}
            disabled={isDisabled}
            startIcon={<SendIcon />}
            className={styles.actionButton}
          >
            Transferir
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/convert")}
            disabled={isDisabled}
            startIcon={<AccountBalanceIcon />}
            className={styles.actionButton}
          >
            Convertir
          </Button>
        </Paper>

        <Box className={styles.transactionHistoryBox} data-aos="fade-up" data-aos-delay="200">
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
