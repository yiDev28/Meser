import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class CashRegister extends Model {}

CashRegister.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "csr_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "csr_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "csr_scope",
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
