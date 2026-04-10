import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class InvoicesSurcharges extends Model {}

InvoicesSurcharges.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "isc_id",
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "invoices",
        key: "inv_id",
      },
      field: "isc_invoice_id",
    },
    paramId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "parameter",
        key: "par_id",
      },
      field: "isc_param_id",
    },
    amount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: "isc_amount",
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
      field: "isc_tax_rate",
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0,
      field: "isc_tax_amount",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "isc_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "isc_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "isc_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "isc_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "isc_last_upt",
    },
  },
  {
    sequelize,
    tableName: "invoices_surcharges",
    timestamps: false,
  },
);

export default InvoicesSurcharges;
