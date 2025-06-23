// Importa los tipos y clases necesarias de Sequelize
import { DataTypes, Model } from "sequelize";
// Importa la instancia de Sequelize configurada
import { sequelize } from "../db";
// Importa el modelo de transacción para establecer relaciones
import { Transaction } from "./Transaction";

// Define la clase Usuario extendiendo Model para usar con Sequelize
export class Usuario extends Model {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public cvu!: string;
  public imagen!: string;          // Campo opcional para avatar o foto de perfil
  public descripcion!: string;     // Campo opcional para descripción personal
  public nacionalidad!: string;    // Campo opcional
  public dni!: string;             // Documento nacional de identidad
  public COD!: {                   // Balance del usuario por moneda (JSON)
    [key: string]: number;
  };
  public admin!: boolean;          // Flag para identificar si es administrador
  public isconfirmed!: boolean;    // Flag para saber si confirmó su cuenta por email
}

// Inicializa el modelo Usuario con sus atributos y restricciones
Usuario.init(
  {
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cvu: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    imagen: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nacionalidad: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dni: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    COD: {
      type: DataTypes.JSON, // Guarda un objeto con saldos por moneda
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
    admin: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // ⚠️ Se permite nulo, pero conviene usar defaultValue: false para consistencia
    },
    isconfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false, // No se guardarán automáticamente campos createdAt/updatedAt
  }
);

// === RELACIONES ===
// Un usuario puede enviar muchas transacciones
Usuario.hasMany(Transaction, {
  foreignKey: "from_user_id",
  as: "sentTransactions"
});

// Un usuario puede recibir muchas transacciones
Usuario.hasMany(Transaction, {
  foreignKey: "to_user_id",
  as: "receivedTransactions"
});

// Cada transacción pertenece a un usuario que envió dinero
Transaction.belongsTo(Usuario, {
  foreignKey: "from_user_id",
  as: "fromUser"
});

// Cada transacción pertenece a un usuario que recibió dinero
Transaction.belongsTo(Usuario, {
  foreignKey: "to_user_id",
  as: "toUser"
});
