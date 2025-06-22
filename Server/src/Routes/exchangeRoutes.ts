// Importa Router desde Express para definir rutas
import { Router } from 'express';

// Importa la función controladora que maneja la lógica de conversión de monedas
import { exchangeCurrency } from '../Controllers/exchangeController';

// Importa el middleware que verifica el token JWT del usuario
import { authenticateToken } from "../Middlewares/authMiddleware";

// Crea una instancia de router para agrupar rutas de intercambio
const router = Router();

// Ruta POST protegida: permite a un usuario autenticado realizar una conversión de moneda
// Se accede como /exchange/me desde el cliente
router.post('/me', authenticateToken, async (req, res, next) => {
  await exchangeCurrency(req, res, next);
});

// Exporta el router para integrarlo en el servidor principal (index.ts)
export default router;
