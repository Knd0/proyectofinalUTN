import express from "express";

import { createTransaction, getMyTransactions } from "../Controllers/transactionController";

import { authenticateToken } from "../Middlewares/authMiddleware"; 

const router = express.Router();

router.post('/send', authenticateToken, async (req, res, next) => {
  await createTransaction(req, res);
});

router.get('/all', authenticateToken, async (req, res,) => {
  await getMyTransactions(req, res);
});

export default router;

