// Importa Router desde express para crear rutas modularizadas
import { Router } from 'express';

// Importa el controlador que gestiona las operaciones de autenticación
import { authController } from '../Controllers/authController';

// Importa el middleware JWT para proteger rutas que requieren autenticación
import { authenticateToken } from '../Middlewares/authMiddleware';

// Crea una instancia de router para definir rutas relacionadas con autenticación
const router = Router();

/* === Rutas Públicas === */

// Ruta POST para registrar un nuevo usuario
// Espera en el body: nombre, email, contraseña, etc.
router.post('/register', async (req, res, next) => {
  await authController.register(req, res, next);
});

// Ruta POST para loguear un usuario existente
// Espera en el body: email y contraseña
router.post('/login', async (req, res, next) => {
  await authController.login(req, res, next);
});

/* === Rutas Protegidas (requieren token JWT válido) === */

// Ruta GET para obtener información del usuario autenticado y su balance
// El token se envía en el header Authorization
router.get('/me', authenticateToken, async (req, res, next) => {
  await authController.getUserInfo(req, res, next);
});

// Ruta PUT para actualizar el perfil del usuario autenticado
router.put('/me', authenticateToken, async (req, res, next) => {
  await authController.updateProfile(req, res, next);
});

// Ruta POST para cargar saldo a la cuenta del usuario autenticado
router.post('/balance', authenticateToken, async (req, res, next) => {
  await authController.loadBalance(req, res, next);
});

// Exporta las rutas para ser utilizadas en el servidor principal
export default router;
