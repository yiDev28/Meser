import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

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
    idNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "cli_id_number",
    },
    token: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cli_token",
    },
    urlImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cli_image_url",
    },  
    imagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "cli_image_path",
    },  
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "cli_status",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "cli_scope",
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
    timestamps: false,
  }
);

