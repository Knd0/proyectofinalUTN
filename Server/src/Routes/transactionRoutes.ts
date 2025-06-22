// Importamos express para definir rutas
import express from "express";

// Importamos los controladores que manejan la lógica de las transacciones
import { createTransaction, getMyTransactions } from "../Controllers/transactionController";

// Importamos el middleware que valida el token JWT del usuario
import { authenticateToken } from "../Middlewares/authMiddleware"; 

// Creamos un router de Express para agrupar las rutas relacionadas con transacciones
const router = express.Router();

// Ruta POST para enviar una transacción
// Aplica el middleware de autenticación y luego ejecuta el controlador createTransaction
router.post('/send', authenticateToken, async (req, res, next) => {
  await createTransaction(req, res);
});

// Ruta GET para obtener todas las transacciones del usuario autenticado
// Aplica el middleware de autenticación y luego ejecuta el controlador getMyTransactions
router.get('/all', authenticateToken, async (req, res) => {
  await getMyTransactions(req, res);
});

// Exportamos el router para usarlo en index.ts
export default router;
