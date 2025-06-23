// Importa Sequelize, el ORM que usamos para interactuar con la base de datos
import { Sequelize } from 'sequelize';

// Carga las variables de entorno definidas en el archivo .env
import dotenv from 'dotenv';
dotenv.config();

// Crea una instancia de Sequelize usando la URL de conexión desde las variables de entorno
export const sequelize = new Sequelize(process.env.DATABASE_URL as string, {
  dialect: 'postgres', // Define que estamos usando PostgreSQL como motor de base de datos
  logging: false,      // Desactiva el logeo de las consultas SQL (útil para evitar ruido en consola)
});
