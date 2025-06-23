// Importa Router desde express para definir rutas de forma modular
import { Router } from "express";

// Importa el controlador que contiene la lógica para funciones administrativas
import { adminController } from "../Controllers/adminController";

// Importa el middleware para verificar que el usuario esté autenticado mediante JWT
import { authenticateToken } from "../Middlewares/authMiddleware"; // el tuyo

// Crea una instancia de Router para definir rutas del panel admin
const router = Router();

/* === RUTAS ADMINISTRATIVAS PROTEGIDAS (requieren token JWT válido) === */

// GET /admin/users
// Devuelve todos los usuarios junto con sus transacciones
// Se espera que el controlador implemente validación para asegurarse de que el usuario autenticado sea admin
router.get('/users', authenticateToken, async (req, res) => {
  await adminController.getAllUsersWithTransactions(req, res);
});

// PUT /admin/users/:id
// Actualiza los datos de un usuario específico por ID
// Requiere autenticación
router.put('/users/:id', authenticateToken, async (req, res) => {
  await adminController.updateUserById(req, res);
});

// DELETE /admin/users/:id
// Elimina un usuario específico por ID
// Requiere autenticación
router.delete('/users/:id', authenticateToken, async (req, res) => {
  await adminController.deleteUserById(req, res);
});

// Exporta el router para ser utilizado en el archivo principal del servidor
export default router;
