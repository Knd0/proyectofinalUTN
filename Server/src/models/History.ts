// Importa lo necesario de Sequelize
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Usuario } from "./Usuario";  // Importa el modelo Usuario para establecer la relación

// Define el modelo History que representa un registro de operación del usuario
export class History extends Model {
  public id!: number;            // ID del registro (autogenerado por Sequelize)
  public Operation!: number;     // Tipo de operación (ej: 1 = carga, 2 = transferencia, etc.)
  public Destiny!: number;       // ID del destinatario de la operación
  public Amount!: JSON;          // Monto involucrado en la operación, en formato JSON
}

// Inicializa el modelo con Sequelize
History.init(
  {
    Operation: {
      type: DataTypes.INTEGER,     // Define el tipo de operación como un número entero
      allowNull: false,
    },
    Destiny: {
      type: DataTypes.INTEGER,     // Representa el destinatario de la operación
      allowNull: false,
    },
    Amount: {
      type: DataTypes.JSON,        // Permite almacenar montos complejos, como objetos con múltiples monedas
      allowNull: false,
    },
  },
  {
    sequelize,                     // Instancia de Sequelize (conexión a la base de datos)
    modelName: "History",          // Nombre interno del modelo
    tableName: "history",          // Nombre de la tabla en la base de datos
    timestamps: false,             // Desactiva los campos createdAt y updatedAt
  }
);

// Relación: un Usuario puede tener múltiples registros en History
Usuario.hasMany(History, { foreignKey: "usuarioId" });

// Relación inversa: cada History pertenece a un Usuario
History.belongsTo(Usuario, { foreignKey: "usuarioId" });
