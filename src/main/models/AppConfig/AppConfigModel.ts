import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";

class AppConfig extends Model {}

AppConfig.init(
  {
    key: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      allowNull: false,
      field: "cfg_key",
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cfg_value",
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "string",
      field: "cfg_type",
    },
    category: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "general",
      field: "cfg_category",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cfg_description",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "cfg_status",
    },
  },
  {
    sequelize,
    tableName: "app_config",
    timestamps: true,
    createdAt: "cfg_created_at",
    updatedAt: "cfg_updated_at",
  }
);

export default AppConfig;