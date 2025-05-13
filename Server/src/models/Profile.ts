import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db";

export class Profile extends Model {
    public id!: number;
    public imagen!: string;
    public descripcion!: string;
    public nacionalidad!: string;
    public dni!: string;
  }
  
  Profile.init(
    {
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
    },
    {
      sequelize,
      modelName: 'Profile',
      tableName: 'profiles',
      timestamps: false,
    }
  );
  