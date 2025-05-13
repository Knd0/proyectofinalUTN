import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Usuario } from "./Usuario";  // Asegúrate de importar el modelo Usuario

export class History extends Model {
  public id!: number;
  public Operation!: number;
  public Destiny!: number;
  public Amount!: JSON;
}

History.init(
  {
    Operation: {
      type: DataTypes.INTEGER,  // Usa INTEGER para números
      allowNull: false,
    },
    Destiny: {
      type: DataTypes.INTEGER,  // Usa INTEGER para números
      allowNull: false,
    },
    Amount: {
      type: DataTypes.JSON,  // Para almacenar objetos
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "History",
    tableName: "history",
    timestamps: false,
  }
);

// Relación: Un Usuario puede tener muchos History
Usuario.hasMany(History, { foreignKey: "usuarioId" });
History.belongsTo(Usuario, { foreignKey: "usuarioId" });
