import { Router } from 'express';
import { convertCurrency } from '../Controllers/exchangeController';
import { authenticateToken } from "../Middlewares/authMiddleware";  // el middleware JWT

const router = Router();

router.post('/exchange', authenticateToken, convertCurrency);

export default router;
