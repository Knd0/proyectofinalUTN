import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // Alias Link to avoid conflict with MUI Link
import AOS from 'aos';
import 'aos/dist/aos.css';

// Import Material-UI Components
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Link, // Material-UI Link component
} from '@mui/material';

// Import Material-UI Icons
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import PriceChangeIcon from '@mui/icons-material/PriceChange';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // For call to action button

// Local images (assuming they are in src/Images, adjust paths if necessary)
import conexion from "../Images/conexion.jpg";
import finanzas from "../Images/finanzas-digitales.jpg";
import graficos from "../Images/graficos-financieros.jpg";
import historial from "../Images/historial-financiero.jpg";
import transacciones from "../Images/transacciones.jpg";

const Landing: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic', // More natural animation easing
    });
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', color: 'text.primary', minHeight: '100vh' }}>
      {/* Header / AppBar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ py: 2 }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Wamoney
            </Typography>
            {/* Navigation (optional, could add if needed, e.g., 'features', 'contact') */}
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', gap: { xs: 6, md: 10 } }}>
        <Box data-aos="fade-right" sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3, lineHeight: 1.2 }}>
            Tu dinero, <Box component="span" sx={{ color: 'primary.main' }}>en control total</Box>
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Gestiona tu dinero y criptomonedas desde un solo lugar. Transfiere, cambia y revisa tu actividad con total seguridad.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Button
              component={RouterLink}
              to="/register"
              variant="contained"
              color="primary"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 'bold' }}
            >
              Empezar ahora
            </Button>
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              color="primary"
              size="large"
              sx={{ py: 1.5, px: 4, borderRadius: 2, fontWeight: 'bold' }}
            >
              Ya tengo cuenta
            </Button>
          </Box>
        </Box>
        <Box data-aos="fade-left" sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <CardMedia
            component="img"
            image={finanzas}
            alt="Finanzas Digitales"
            sx={{
              borderRadius: 3,
              boxShadow: 10,
              width: '100%',
              maxWidth: { xs: 400, sm: 500, md: 600 }, // Responsive max-width
              height: 'auto',
            }}
          />
        </Box>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6, color: 'text.primary' }}>
            Nuestras Características Principales
          </Typography>
          <Grid container spacing={4}>
            <Grid>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 6, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={transacciones}
                  alt="Depósito Multimoneda"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', display: 'flex', alignItems: 'center' }}>
                    <AccountBalanceWalletIcon sx={{ mr: 1 }} /> Depósito Multimoneda
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Carga saldo en pesos, dólares, euros y criptomonedas como Bitcoin o Ethereum. Todo en una sola cuenta.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 6, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={graficos}
                  alt="Cambio en Tiempo Real"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', display: 'flex', alignItems: 'center' }}>
                    <PriceChangeIcon sx={{ mr: 1 }} /> Cambio en Tiempo Real
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Convierte entre monedas al instante usando los valores de mercado actualizados minuto a minuto.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 6, transition: 'transform 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: 10 } }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={conexion}
                  alt="Transferencias P2P"
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.dark', display: 'flex', alignItems: 'center' }}>
                    <PeopleOutlineIcon sx={{ mr: 1 }} /> Transferencias P2P
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Envía y recibe dinero con otros usuarios de forma rápida y segura, sin intermediarios.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* History Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 16 }, display: 'flex', flexDirection: { xs: 'column-reverse', md: 'row' }, alignItems: 'center', gap: { xs: 6, md: 10 } }}>
        <Box data-aos="fade-right" sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <CardMedia
            component="img"
            image={historial}
            alt="Historial Financiero"
            sx={{
              borderRadius: 3,
              boxShadow: 10,
              width: '100%',
              maxWidth: { xs: 400, sm: 500, md: 600 },
              height: 'auto',
            }}
          />
        </Box>
        <Box data-aos="fade-left" sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <HistoryIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} /> Historial completo y transparente
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Visualiza todas tus transacciones: cambios de divisa, transferencias P2P y recargas. Cada operación queda registrada con fecha, hora y detalle.
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Nuestra app prioriza la seguridad y transparencia. Todo tu historial está protegido y solo accesible para vos.
          </Typography>
        </Box>
      </Container>

      {/* Call to Action Footer */}
      <Box sx={{ bgcolor: 'background.paper', py: { xs: 8, md: 12 }, textAlign: 'center', mt: 'auto' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 'bold', mb: 4, color: 'text.primary' }}>
            ¿Listo para tomar el control de tu dinero?
          </Typography>
          <Button
            component={RouterLink}
            to="/register"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{ py: 1.5, px: 6, borderRadius: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
          >
            Crear cuenta gratis
          </Button>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 3 }}>
            Sin costos ocultos. Sin complicaciones. 100% digital.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;