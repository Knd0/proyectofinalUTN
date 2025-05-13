import { Sequelize } from 'sequelize';

// Configura la conexión a la base de datos
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', 
  logging: false, 
});
