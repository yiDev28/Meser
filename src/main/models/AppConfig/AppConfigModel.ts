import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";

class AppConfig extends Model {}

AppConfig.init(
  {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: "cfg_key",
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cfg_value",
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