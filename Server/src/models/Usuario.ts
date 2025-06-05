import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";
import { Transaction } from "./Transaction";


export class Usuario extends Model {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public password!: string;
  public cvu!: string;
  public imagen!: string; // Nuevo campo imagen
  public descripcion!: string; // Nuevo campo descripcion
  public nacionalidad!: string; // Nuevo campo nacionalidad
  public dni!: string; // Nuevo campo dni
  public COD!: {
    [key: string]: number; // Esto permite el acceso a las propiedades mediante una cadena.
  };
  public admin!: boolean;
}

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
      type: DataTypes.JSON,
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
      allowNull: true,
    },
    isConfirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },

  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: false,
  }
);
  
Usuario.hasMany(Transaction, {
  foreignKey: "from_user_id",
  as: "sentTransactions"
});

Usuario.hasMany(Transaction, {
  foreignKey: "to_user_id",
  as: "receivedTransactions"
});

Transaction.belongsTo(Usuario, {
  foreignKey: "from_user_id",
  as: "fromUser"
});

Transaction.belongsTo(Usuario, {
  foreignKey: "to_user_id",
  as: "toUser"
});