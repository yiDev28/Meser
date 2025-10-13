import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";

class CashMovement extends Model {}

CashMovement.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "csm_id",
    },
    cashRegisterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cash_registers",
        key: "csr_id",
      },
      field: "csm_cash_register_id",
    },
    typeMovement: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cash_type_movement",
        key: "ctm_id",
      },
      field: "csm_type_movement",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "csm_description",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "csm_amount",
    },
    // Campos comunes
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "csm_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "csm_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "csm_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "csm_last_upt",
    },
  },
  {
    sequelize,
    tableName: "cash_movements",
    timestamps: false,
  }
);

export { CashMovement };
