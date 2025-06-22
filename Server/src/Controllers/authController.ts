import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/Usuario";
import { generateUniqueCVU } from "../utils/GenerateCVU";
import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
import { sendTransactionEmail } from "../utils/emailService";

const mercadopago = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN!,
});
const preference = new Preference(mercadopago);
const payment = new Payment(mercadopago);

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET || "default_secret";

export const authController = {
  // 📄 Obtener datos del usuario autenticado
  getUserInfo: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await Usuario.findOne({ where: { id: decoded.id } });

      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

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
      return res.status(500).json({ error: "Error al obtener información del usuario" });
    }
  },

  // 📝 Registrar nuevo usuario
  register: async (req: Request, res: Response): Promise<Response> => {
    const { nombre, email, password, dni, nacionalidad } = req.body;

    if (!nombre || !email || !password || !dni || !nacionalidad) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    try {
      const existingUser = await Usuario.findOne({ where: { email } });
      if (existingUser) return res.status(409).json({ error: "El email ya está registrado" });

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const cvu = await generateUniqueCVU();

      const newUser = await Usuario.create({
        nombre,
        email,
        password: hashedPassword,
        cvu,
        imagen: "https://t4.ftcdn.net/jpg/02/15/84/43/240_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
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

      return res.status(201).json({ message: "Usuario creado correctamente", usuario: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Error al crear el usuario" });
    }
  },

  // 🔐 Login
  login: async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ error: "Faltan campos obligatorios" });

    try {
      const user = await Usuario.findOne({ where: { email } });
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "3h" });

      return res.json({
        token,
        user: { id: user.id, nombre: user.nombre, email: user.email },
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  // 💰 Cargar balance
  loadBalance: async (req: Request, res: Response) => {
    const { amount, currency } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (typeof amount !== "number" || typeof currency !== "string") {
      return res.status(400).json({ error: "Datos inválidos" });
    }

    try {
      const validCurrencies = ["ARS", "USD", "EUR", "BTC", "ETH", "USDT"];
      if (!validCurrencies.includes(currency)) {
        return res.status(400).json({ error: "Moneda no válida" });
      }

      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const user = await Usuario.findByPk(decoded.id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

      const newBalance = {
        ...user.COD,
        [currency]: user.COD[currency] + amount,
      };

      await Usuario.update({ COD: newBalance }, { where: { id: user.id } });

      try {
        const mensaje = `Tu cuenta fue acreditada con <strong>${amount} ${currency}</strong>. ¡Gracias por usar Wamoney! 💸`;
        await sendTransactionEmail(user.email, user.nombre, mensaje);
      } catch (e) {
        console.error("Error al enviar email:", e);
      }

      return res.json({
        message: `Balance de ${currency} actualizado correctamente`,
        balance: newBalance,
      });
    } catch (error) {
      console.error("Error en loadBalance:", error);
      return res.status(500).json({ error: "Error al cargar el balance" });
    }
  },

  // 🖋️ Editar perfil
  updateProfile: async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ error: "Token no proporcionado" });

      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;

      const { imagen, descripcion, nacionalidad, dni } = req.body;

      await Usuario.update({ imagen, descripcion, nacionalidad, dni }, { where: { id: userId } });
      const updatedUser = await Usuario.findByPk(userId);

      return res.json({ message: "Perfil actualizado", user: updatedUser });
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      return res.status(500).json({ error: "Error al actualizar el perfil" });
    }
  },
};
