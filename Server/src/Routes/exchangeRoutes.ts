import { Router } from 'express';
import { convertBalance } from '../Controllers/exchangeController';
import { authenticateToken } from "../Middlewares/authMiddleware";  // el middleware JWT

const router = Router();

router.post('/exchange', authenticateToken, convertBalance);

export default router;
