import { DataTypes } from "sequelize";
import { sequelize } from "../db";

export const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING(5),
    allowNull: false,
    validate: {
      isIn: [['ARS', 'USD', 'EUR', 'BTC', 'ETH', 'USDT']],
    },
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: "transactions",
  timestamps: false
});

