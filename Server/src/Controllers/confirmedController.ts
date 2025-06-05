import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { sendTransactionEmail } from "../utils/emailService";
import { sendConfirmationEmailTemplate } from '../utils/emailTemplates';
// Envía el correo de confirmación
export const sendConfirmationEmail = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", {
      expiresIn: "1h",
    });

    const confirmationLink = `https://proyectofinalutn2025.vercel.app/confirm/${token}`;

    const html = sendConfirmationEmailTemplate(user.nombre, confirmationLink);

    await sendTransactionEmail(user.email, "Confirmación de cuenta", html);
    return res.json({ message: "Correo de confirmación enviado" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al enviar el email" });
  }
};

// Procesa la confirmación del token
export const confirmAccount = async (req: Request, res: Response) => {
  const { token } = req.params;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    const user = await Usuario.findByPk(decoded.id);

    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.update({ isConfirmed: true });
    return res.redirect("https://proyectofinalutn2025.vercel.app/confirmado"); // O una pantalla de éxito
  } catch (err) {
    return res.status(400).json({ error: "Token inválido o expirado" });
  }
};
