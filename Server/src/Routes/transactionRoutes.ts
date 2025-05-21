import express from "express";
import { createTransaction } from "../Controllers/transactionController";
import { authenticateToken } from "../Middlewares/authMiddleware"; 

const router = express.Router();

// Ruta protegida
router.post("/send", authenticateToken, createTransaction);

export default router;
