import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { sendTransactionEmail } from "../utils/emailService";
import { sendConfirmationEmailTemplate } from "../utils/emailTemplates";

// ✅ Envía el correo de confirmación de cuenta
export const sendConfirmationEmail = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // 🔐 Crear token JWT con expiración de 1 hora
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1h",
    });

    const confirmationLink = `https://proyectofinalutn2025.vercel.app/confirm/${token}`;
    const html = sendConfirmationEmailTemplate(user.nombre, confirmationLink);

    // 📧 Enviar email usando plantilla
    await sendTransactionEmail(user.email, "Confirmación de cuenta", html);

    res.status(200).json({ message: "Correo de confirmación enviado" });
  } catch (err) {
    console.error("Error al enviar el correo:", err);
    res.status(500).json({ error: "Error al enviar el email" });
  }
};

// ✅ Confirma la cuenta usando el token recibido por correo
export const confirmAccount = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  try {
    // 🔍 Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { id: number };
    const user = await Usuario.findByPk(decoded.id);

    if (!user) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // ☑️ Marcar cuenta como confirmada
    await user.update({ isconfirmed: true });

    res.status(200).json({ message: "Cuenta confirmada correctamente" });
  } catch (err) {
    console.error("Error al confirmar cuenta:", err);
    res.status(400).json({ error: "Token inválido o expirado" });
  }
};
