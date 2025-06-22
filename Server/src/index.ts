// Carga las variables de entorno desde .env
import dotenv from "dotenv";
dotenv.config();

// Importaciones necesarias
import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser"; // Middleware para parsear JSON
import cors from "cors";              // Middleware para habilitar CORS
import authRoutes from "./Routes/authRoutes";
import { sequelize } from "./db";    // Conexión a la base de datos
import { Usuario } from "./models/Usuario"; // (opcional, puede ser útil si se usan middlewares con usuario)
import jwt from "jsonwebtoken"; // No se usa en este archivo directamente, pero queda importado por si se usa en middlewares
import transactionRoutes from "./Routes/transactionRoutes";
import exchangeRoutes from "./Routes/exchangeRoutes";
import adminRoutes from "./Routes/adminRoutes";
import confirmationRoutes from "./Routes/confirmationRoutes";
import forgotPasswordRoutes from "./Routes/forgotPasswordRoutes";

const app = express(); // Inicializa la app de Express

// Configuración de CORS para permitir acceso desde el frontend hospedado en Vercel
app.use(
  cors({
    origin: "https://proyectofinalutn2025.vercel.app", // origen permitido
    methods: ["GET", "POST", "PUT", "DELETE"],          // métodos permitidos
    allowedHeaders: ["Content-Type", "Authorization"],  // headers permitidos
    credentials: true,                                  // permite envío de cookies si se usan
  })
);

// Middleware para interpretar cuerpos JSON en las solicitudes
app.use(bodyParser.json());

// Registro de rutas organizadas por funcionalidad
app.use("/auth", authRoutes);                  // Login, registro, perfil, carga de saldo
app.use("/transactions", transactionRoutes);   // Envío y recepción de fondos
app.use("/exchange", exchangeRoutes);          // Conversión de monedas
app.use("/admin", adminRoutes);                // Funciones para administrador
app.use("/email", confirmationRoutes as express.Router); // Confirmación por email
app.use("/auth", forgotPasswordRoutes);        // Olvido de contraseña

// Middleware de manejo global de errores (evita que el servidor caiga en caso de error no manejado)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err); // Muestra error en consola
  res
    .status(500)
    .json({
      message: "Ha ocurrido un error en el servidor", // Mensaje genérico
      error: err.message,                             // Detalle del error para debugging
    });
});

// Puerto de escucha (por defecto 5000 si no se define en .env)
const port = process.env.PORT || 5000;

// Sincronización con la base de datos y arranque del servidor
sequelize
  .sync({ force: false }) // `force: false` evita que se borren las tablas en cada arranque
  .then(() => {
    console.log("Base de datos sincronizada correctamente");
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Error al sincronizar la base de datos:", error);
  });
