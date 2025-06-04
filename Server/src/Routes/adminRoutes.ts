import { Router } from "express";
import { adminController } from "../Controllers/adminController";
import { authenticateToken } from "../Middlewares/authMiddleware"; // el tuyo

const router = Router();

router.get('/admin/users', authenticateToken, async (req, res) => {
  await adminController.getAllUsersWithTransactions(req, res);
});

router.put('/admin/users/:id', authenticateToken, async (req, res) => {
  await adminController.updateUserById(req, res);
});

router.delete('/admin/users/:id', authenticateToken, async (req, res) => {
  await adminController.deleteUserById(req, res);
});

export default router;
