// Importa Router desde express para definir rutas modularizadas
import { Router } from "express";

// Importa los controladores que manejan el envío y confirmación de correos
import { sendConfirmationEmail, confirmAccount } from "../Controllers/confirmedController";

// Crea una instancia del router para agrupar las rutas relacionadas con confirmación de cuenta
const router = Router();

// Ruta POST para enviar un correo de confirmación a un usuario
// No requiere autenticación previa (se usa después del registro)
router.post("/send-confirmation", sendConfirmationEmail);

// Ruta GET para confirmar una cuenta mediante un token único en la URL
// Este token es generado y enviado por email al registrarse
router.get("/confirm/:token", confirmAccount);

// Exporta el router para ser usado en el servidor principal (index.ts)
export default router;
