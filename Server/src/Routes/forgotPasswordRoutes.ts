// Importa Express para crear rutas
import express from "express";

// Importa las funciones del controlador relacionadas con recuperación de contraseña
import { forgotPassword, resetPassword } from "../Controllers/forgotPasswordController";

// Crea una instancia de Router para agrupar estas rutas
const router = express.Router();

// Ruta para solicitar restablecimiento de contraseña (envía email con enlace)
// No requiere autenticación porque se usa cuando el usuario no puede iniciar sesión
router.post('/forgot-password', async (req, res) => {
  await forgotPassword(req, res);
});

// Ruta para restablecer la contraseña con un token válido desde el enlace del correo
router.post('/reset-password/:token', async (req, res) => {
  await resetPassword(req, res);
});

// Exporta el router para ser usado en index.ts
export default router;
