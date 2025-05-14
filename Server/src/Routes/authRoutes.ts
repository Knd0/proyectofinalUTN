import { Router } from 'express';
import { authController } from '../Controllers/authController';
import { authenticateToken } from '../Middlewares/authMiddleware';  // Importa tu middleware

const router = Router();

// Rutas de autenticación
router.post('/register', async (req, res, next) => {
  await authController.register(req, res, next);
});

router.post('/login', async (req, res, next) => {
  await authController.login(req, res, next);
});

// Ruta para obtener la información del usuario y su balance (protegida)
router.get('/me', authenticateToken, async (req, res, next) => {
  await authController.getUserInfo(req, res, next);
});

router.put('/me', authenticateToken, async (req, res, next) => {
  await authController.updateProfile(req, res, next);
});

router.post('/create-preference', authenticateToken, async (req, res) => {
  await authController.createPreference(req, res);
});

router.post('/balance', authenticateToken, async (req, res, next) => {
  await authController.loadBalance(req, res, next);
});

export default router;
