// Importa tipos necesarios desde Sequelize
import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

// Define la clase Profile que extiende del modelo base de Sequelize
export class Profile extends Model {
  public id!: number; // ID primario (se infiere automáticamente)
  public imagen!: string;         // URL de imagen de perfil
  public descripcion!: string;    // Breve descripción del usuario
  public nacionalidad!: string;   // Nacionalidad del usuario
  public dni!: string;            // Documento Nacional de Identidad
}

// Inicializa el modelo con sus campos
Profile.init(
  {
    imagen: {
      type: DataTypes.STRING,
      allowNull: true, // No obligatorio
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true, // No obligatorio
    },
    nacionalidad: {
      type: DataTypes.STRING,
      allowNull: true, // No obligatorio
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: true, // No obligatorio
    },
  },
  {
    sequelize,               // Instancia de conexión
    modelName: 'Profile',    // Nombre del modelo
    tableName: 'profiles',   // Nombre explícito de la tabla en la DB
    timestamps: false,       // No agrega createdAt ni updatedAt
  }
);
