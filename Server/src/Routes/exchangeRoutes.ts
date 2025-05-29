import { Router } from 'express';
import { exchangeCurrency } from '../Controllers/exchangeController';
import { authenticateToken } from "../Middlewares/authMiddleware";  // el middleware JWT

const router = Router();

router.post('/me', authenticateToken, async (req, res, next) => {
  await exchangeCurrency(req, res, next);
});
export default router;
