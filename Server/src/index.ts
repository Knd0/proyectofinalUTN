// Carga las variables de entorno desde el archivo .env
import dotenv from "dotenv";
dotenv.config();

// Importa las dependencias necesarias de Express
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Middleware para parsear cuerpos JSON
import cors from "cors"; // Middleware para habilitar CORS

// Importa las rutas del proyecto
import authRoutes from "./Routes/authRoutes";
import { sequelize } from "./db"; // Conexión con la base de datos Sequelize
import { Usuario } from "./models/Usuario"; // Modelo de usuario
import jwt from "jsonwebtoken"; // Utilidad para trabajar con JWT

// Importa más rutas
import transactionRoutes from "./Routes/transactionRoutes";
import exchangeRoutes from "./Routes/exchangeRoutes";
import adminRoutes from "./Routes/adminRoutes";
import confirmationRoutes from "./Routes/confirmationRoutes";
import forgotPasswordRoutes from "./Routes/forgotPasswordRoutes";

// Inicializa la aplicación Express
const app = express();

// Configura CORS para permitir solicitudes desde el frontend
app.use(
  cors({
    origin: "https://proyectofinalutn2025.vercel.app", // Origen permitido
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    allowedHeaders: ["Content-Type", "Authorization"], // Headers permitidos
    credentials: true, // Permitir cookies y headers de autenticación
  })
);

// Middleware que permite leer el cuerpo de las solicitudes en formato JSON
app.use(bodyParser.json());

// Usa las rutas de autenticación bajo el prefijo /auth
app.use("/auth", authRoutes);

// Usa las rutas para transacciones bajo el prefijo /transactions
app.use("/transactions", transactionRoutes);

// Usa las rutas para conversión de divisas bajo el prefijo /exchange
app.use("/exchange", exchangeRoutes);

// Usa las rutas de administración bajo el prefijo /admin
app.use("/admin", adminRoutes);

// Usa las rutas de confirmación de email bajo el prefijo /email
app.use("/email", confirmationRoutes as express.Router); 

// Usa las rutas de recuperación de contraseña bajo el prefijo /auth
app.use("/auth", forgotPasswordRoutes);

// Middleware global para manejar errores no atrapados por otras rutas
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Muestra el error en consola
  res
    .status(500) // Devuelve error 500 (interno del servidor)
    .json({
      message: "Ha ocurrido un error en el servidor",
      error: err.message,
    });
});

// Define el puerto en el que correrá el servidor
const port = process.env.PORT || 5000;

// Sincroniza la base de datos y levanta el servidor
sequelize
  .sync({ force: false }) // No borra las tablas existentes
  .then(() => {
    console.log("Base de datos sincronizada correctamente");
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
