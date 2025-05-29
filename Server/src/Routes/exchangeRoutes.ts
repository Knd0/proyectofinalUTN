import { Router } from 'express';
import { exchangeCurrency } from '../Controllers/exchangeController';
import { authenticateToken } from "../Middlewares/authMiddleware";  // el middleware JWT

const router = Router();

router.post('/exchange', authenticateToken, exchangeCurrency);

export default router;
