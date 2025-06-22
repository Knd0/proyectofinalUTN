// Importa las utilidades necesarias de Sequelize
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

// Define el modelo Currency, asociado a un usuario
export class Currency extends Model {
  public id!: number; // ID autoincremental de la tabla
  public usuarioId!: number; // Clave foránea que enlaza con el usuario
  public COD!: {
    ARS: number;
    USD: number;
    EUR: number;
    BTC: number;
    ETH: number;
    USDT: number;
  }; // Objeto con los saldos de las distintas monedas
}

// Inicializa el modelo con Sequelize
Currency.init(
  {
    usuarioId: {
      type: DataTypes.INTEGER, // ID del usuario asociado
      allowNull: false,
    },
    COD: {
      type: DataTypes.JSON, // Saldos multimoneda
      allowNull: false,
      defaultValue: {
        ARS: 0,
        USD: 0,
        EUR: 0,
        BTC: 0,
        ETH: 0,
        USDT: 0,
      },
    },
  },
  {
    sequelize,             // Conexión a la base de datos
    modelName: "Currency", // Nombre del modelo
    tableName: "currency", // Nombre real de la tabla
    timestamps: false,     // Desactiva createdAt y updatedAt
  }
);
