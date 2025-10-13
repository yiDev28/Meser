import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";

class CashTypeMovement extends Model {}

CashTypeMovement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "ctm_id",
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "ctm_description",
    },
    affectsCash: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "ctm_affects_cash",
    },
    affectsMode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ctm_affects_mode",
    },
    // Campos comunes
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ctm_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "ctm_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ctm_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ctm_last_upt",
    },
  },
  {
    sequelize,
    tableName: "cash_type_movement",
    timestamps: false,
  }
);

export { CashTypeMovement };
