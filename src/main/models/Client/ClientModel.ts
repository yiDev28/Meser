import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

export class Client extends Model {}

Client.init(
  {
    id: {
      type: DataTypes.TEXT,
      primaryKey: true,
      field: "cli_id",
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "cli_name",
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cli_token",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "cli_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "cli_last_upt",
    },
  },
  {
    sequelize,
    tableName: "client",
    timestamps: false, // Evita que Sequelize agregue 'createdAt' y 'updatedAt'
  }
);

