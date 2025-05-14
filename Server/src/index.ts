import dotenv from "dotenv";
dotenv.config();
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importa cors
import authRoutes from './Routes/authRoutes'; // Asegúrate de importar correctamente las rutas
import { sequelize } from './db';  // Importa la instancia de Sequelize
import { Usuario } from './models/Usuario';
import  jwt  from 'jsonwebtoken';


const app = express();

// Configura CORSS
app.use(cors({
  origin: 'https://proyectofinalutn-production.up.railway.app',  // Permite solicitudes desde el frontend en localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
  allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
  credentials: true,
}));

// Middleware para parsear JSON en el body
app.use(bodyParser.json());

// Rutas de autenticación
app.use('/auth', authRoutes);

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
