import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { sendTransactionEmail } from "../utils/emailService";
import { sendConfirmationEmailTemplate } from "../utils/emailTemplates";

// Envía el correo de confirmación
export const sendConfirmationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Crear token JWT para confirmación (1 hora de expiración)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1h",
    });

    const confirmationLink = `https://proyectofinalutn2025.vercel.app/confirm/${token}`;
    const html = sendConfirmationEmailTemplate(user.nombre, confirmationLink);

    await sendTransactionEmail(user.email, "Confirmación de cuenta", html);

    res.status(200).json({ message: "Correo de confirmación enviado" });

  } catch (err) {
    console.error("Error al enviar el correo:", err);
    res.status(500).json({ error: "Error al enviar el email" });
  }
};

// Procesa la confirmación del token y cambia isconfirmed a true
export const confirmAccount = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    // Verificar token y obtener id usuario
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { id: number };
    const user = await Usuario.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    await user.update({ isconfirmed: true });

    // Responder con JSON para que el frontend maneje navegación
    res.status(200).json({ message: "Cuenta confirmada correctamente" });

  } catch (err) {
    console.error("Error al confirmar cuenta:", err);
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};
