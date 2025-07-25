import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { generateUniqueCVU } from "../utils/GenerateCVU";
import axios from "axios";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { sendTransactionEmail } from "../utils/emailService";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
const preference = new Preference(mercadopago);
const payment = new Payment(mercadopago);

const CURRENCY_API_KEY = process.env.CURRENCY_API_KEY;
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret"; // Valor predeterminado

export const authController = {
  // Obtener información del usuario, incluyendo perfil y balance
  getUserInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1]; // Extrae el token del formato "Bearer token"
      if (!token) {
        return res.status(401).json({ error: "Token no proporcionado" });
      }

      // Verificar y decodificar el token
      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      const userId = decoded.id;


      // Obtener el usuario con perfil y balance
      const user = await Usuario.findOne({
        where: { id: userId },
      });

      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.json({
        user: {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          admin: user.admin,
          isconfirmed: user.isconfirmed,
          cvu: user.cvu,
          perfil: {
            imagen: user.imagen,
            descripcion: user.descripcion,
            nacionalidad: user.nacionalidad,
            dni: user.dni,
          },
          balance: user.COD,
        },
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: "Error al obtener la información del usuario" });
    }
  },
  // Registro de un nuevo usuario
  register: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> => {
    const { nombre, email, password, dni, nacionalidad} = req.body;

    if (!nombre || !email || !password || !dni || !nacionalidad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const userExists = await Usuario.findOne({ where: { email } });
      if (userExists) {
        return res.status(409).json({ error: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const cvu = await generateUniqueCVU();

      const newUser = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        cvu,
        imagen:
          "https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
        descripcion: "",
        nacionalidad,
        dni,
        COD: {
          ARS: 0,
          USD: 0,
          EUR: 0,
          BTC: 0,
          ETH: 0,
          USDT: 0,
        },
        isconfirmed: false
      });
      
      const token = jwt.sign(
      { id: newUser.id },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1h" }
      );

      // 📧 Armar link de confirmación
      const confirmationLink = `https://proyectofinalutn2025.vercel.app/confirm/${token}`
      // 📧 Enviar mail con link (usando el ya funcional sendTransactionEmail)
      const mensaje = `
      Gracias por registrarte. Para confirmar tu cuenta hacé clic en el botón:
      <br><br>
      <a href="${confirmationLink}" 
      style="display:inline-block;padding:12px 24px;background-color:#10b981;color:white;
            text-decoration:none;border-radius:8px;font-weight:bold;">
      Confirmar cuenta
      </a>
      <br><br>
      Si no te registraste, podés ignorar este correo.
      `;

      await sendTransactionEmail(newUser.email, newUser.nombre, mensaje);
      
      return res
        .status(201)
        .json({ message: "Usuario creado correctamente", usuario: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  // Inicio de sesión de usuario
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const user = await Usuario.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Contraseña incorrecta" });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
        expiresIn: "3h",
      });

      return res.json({
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // Carga de balance de usuario
  loadBalance: async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency } = req.body;

    console.log("🔁 Datos recibidos:", { amount, currency });

    const token = req.headers.authorization?.split(" ")[1];
    console.log("🔑 Token recibido:", token ? "Sí" : "No");

    if (typeof amount !== "number" || typeof currency !== "string") {
      console.log("❌ Campos inválidos:", { amount, currency });
      return res
        .status(400)
        .json({ error: "Faltan campos obligatorios o tipo incorrecto" });
    }

    try {
      const validCurrencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];
      if (!validCurrencies.includes(currency)) {
        console.log("❌ Moneda no válida:", currency);
        return res.status(400).json({ error: "Moneda no válida" });
      }

      if (!token) {
        console.log("❌ Token no proporcionado");
        return res.status(401).json({ error: "Token no proporcionado" });
      }

      const decoded: any = jwt.verify(
        token,
        process.env.JWT_SECRET || "default_secret"
      );
      const userId = decoded.id;
      console.log("✅ Token verificado. Usuario ID:", userId);


      const user = await Usuario.findOne({ where: { id: userId } });

      if (!user) {
        console.log("❌ Usuario no encontrado");
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      const currentCOD = user.COD;
      console.log("📊 Balance actual:", currentCOD);


      
      if (!(currency in currentCOD)) {
        console.log("❌ Moneda no existe en COD:", currency);
        return res
          .status(400)
          .json({ error: "Moneda no válida en el balance" });
      }

      const updatedCOD = {
        ...currentCOD,
        [currency]: currentCOD[currency] + amount,
      };

      console.log("📝 Nuevo balance COD:", updatedCOD);

      await Usuario.update({ COD: updatedCOD }, { where: { id: userId } });

      try {
        const mensaje = `Tu cuenta fue acreditada con <strong>${amount} ${currency}</strong>. ¡Gracias por usar Wamoney! 💸`;
        console.log("📧 Enviando email a:", user.email);
        await sendTransactionEmail(user.email, user.nombre, mensaje);
        console.log("✅ Email enviado correctamente");
      } catch (emailError) {
        console.error("❌ Error al enviar el email:", emailError);
      }



      console.log("✅ Balance actualizado correctamente");
      
      return res.json({
        message: `Balance de ${currency} actualizado correctamente`,
        balance: updatedCOD,
      });
    } catch (error) {
      console.error("🔥 Error en loadBalance:", error);
      return res.status(500).json({ error: "Error al cargar el balance" });
    }
  },
  
  updateProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const { nombre, perfil } = req.body;
      const { imagen, descripcion, nacionalidad, dni } = perfil || {};

      await Usuario.update(
        { imagen, descripcion, nacionalidad, dni },
        { where: { id: userId } }
      );
      const updateData: any = {};
      if (nombre !== undefined) updateData.nombre = nombre;
      if (imagen !== undefined) updateData.imagen = imagen;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (nacionalidad !== undefined) updateData.nacionalidad = nacionalidad;
      if (dni !== undefined) updateData.dni = dni;

      await Usuario.update(updateData, { where: { id: userId } });




      const updatedUser = await Usuario.findByPk(userId);

      if (!updatedUser) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }

      return res.json({
        message: "Perfil actualizado",
        user: {
          id: updatedUser.id,
          nombre: updatedUser.nombre,
          email: updatedUser.email,
          admin: updatedUser.admin,
          isconfirmed: updatedUser.isconfirmed,
          cvu: updatedUser.cvu,
          perfil: {
            imagen: updatedUser.imagen,
            descripcion: updatedUser.descripcion,
            nacionalidad: updatedUser.nacionalidad,
            dni: updatedUser.dni,
          },
          balance: updatedUser.COD,
        },
      });
    } catch (error) {
      console.error("❌ Error al actualizar perfil:", error);
      return res.status(500).json({ error: "Error al actualizar el perfil" });
    }
  },

}

