import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";

class CashRegister extends Model {}

CashRegister.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "csr_id",
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "csr_opened_at",
    },
    closedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "csr_closed_at",
    },
    initialAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "csr_initial_amount",
    },
     isOpen: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      default:false,
      field: "csr_is_open",
    },
    // Campos comunes
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "csr_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "csr_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "csr_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "csr_last_upt",
    },
  },
  {
    sequelize,
    tableName: "cash_registers",
    timestamps: false,
  }
);

export { CashRegister };
