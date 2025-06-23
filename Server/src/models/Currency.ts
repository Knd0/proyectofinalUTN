import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Currency extends Model {
  public id!: number;
  public usuarioId!: number;
  public COD!: {
    ARS: number;
    USD: number;
    EUR: number;
    BTC: number;
    ETH: number;
    USDT: number;
  }
}

Currency.init(
  {
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  },
  {
    sequelize,
    modelName: "Currency",
    tableName: "currency",
    timestamps: false,
  }
);
