import { Router } from "express";
import { adminController } from "../Controllers/adminController";
import { authenticateToken } from "../Middlewares/authMiddleware"; // el tuyo

const router = Router();

router.get('/users', authenticateToken, async (req, res) => {
  await adminController.getAllUsersWithTransactions(req, res);
});

/* router.put('/users/:id', authenticateToken, async (req, res) => {
  await adminController.updateUserById(req, res);
}); */

router.delete('/users/:id', authenticateToken, async (req, res) => {
  await adminController.deleteUserById(req, res);
});

export default router;
