import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Usuario } from "../models/Usuario"; 
import { transporter } from "../utils/emailService"; 

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ error: "No existe un usuario con ese correo" });
    }

    const token = jwt.sign(
      { id: usuario.id, purpose: "password-reset" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
    );

    const resetLink = `https://proyectofinalutn2025.vercel.app/reset-password/${token}`; // URL del frontend

    const html = `
      <h2>Hola, ${usuario.nombre}</h2>
      <p>Hiciste una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetLink}" target="_blank">${resetLink}</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;

    await transporter.sendMail({
      from: `"Wamoney" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña - Wamoney",
      html,
    });

    res.json({ message: "Se envió un correo con el enlace de recuperación." });
  } catch (error) {
    console.error("Error en forgotPassword:", error);
    res.status(500).json({ error: "Error al procesar la solicitud." });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { nuevaPassword } = req.body;

  if (!nuevaPassword) {
    return res.status(400).json({ error: "Debes proporcionar una nueva contraseña." });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");

    if (decoded.purpose !== "password-reset") {
      return res.status(403).json({ error: "Token no válido para este propósito." });
    }

    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
    usuario.password = hashedPassword;
    await usuario.save();

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (err) {
    console.error("Error en resetPassword:", err);
    res.status(400).json({ error: "Token inválido o expirado." });
  }
};
