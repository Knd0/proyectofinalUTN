// Importa tipos necesarios desde Sequelize
import { DataTypes } from "sequelize";
// Importa la instancia de Sequelize previamente configurada
import { sequelize } from "../db";

// Define el modelo de transacciones con Sequelize
export const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Se incrementa automáticamente
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Usuario que envía la transacción
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Usuario que recibe la transacción
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2), // Monto transferido (soporta decimales grandes)
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5), // Tipo de moneda (hasta 5 caracteres)
    allowNull: false,
    validate: {
      isIn: [['ARS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT']], // Solo permite estas monedas
    },
  },
  date: {
    type: DataTypes.DATE, // Fecha en que se hizo la transacción
    defaultValue: DataTypes.NOW, // Por defecto, la fecha actual
  },
}, {
  tableName: "transactions", // Nombre explícito de la tabla
  timestamps: false, // No usa campos createdAt ni updatedAt
});
