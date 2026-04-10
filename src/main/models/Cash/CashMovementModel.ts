import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class CashMovement extends Model {}

CashMovement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "csm_id",
    },
    cashRegisterId: {
      type: DataTypes.UUID,
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
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "csm_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "csm_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "csm_scope",
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
  },
);

export { CashMovement };
