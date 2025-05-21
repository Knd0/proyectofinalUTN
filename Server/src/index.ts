import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importa cors
import authRoutes from './Routes/authRoutes'; // Asegúrate de importar correctamente las rutas
import { sequelize } from './db';  // Importa la instancia de Sequelize
import { Usuario } from './models/Usuario';
import  jwt  from 'jsonwebtoken';
import transactionRoutes from './Routes/transactionRoutes';


const app = express();

// Configura CORSS
const allowedOrigins = ['http://localhost:3000', 'https://proyectofinalutn2025.vercel.app/']; // Agrega también el dominio real de tu frontend si aplica

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


// Middleware para parsear JSON en el body
app.use(bodyParser.json());

// Rutas de autenticación
app.use('/auth', authRoutes);
app.use('/transactions', transactionRoutes);

// Manejo de errores global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Ha ocurrido un error en el servidor', error: err.message });
});

const port = process.env.PORT || 5000;


sequelize.sync({ force: false })
  .then(() => {
    console.log('Base de datos sincronizada correctamente');
    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
