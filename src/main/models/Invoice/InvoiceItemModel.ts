import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class InvoicesItems extends Model {}

InvoicesItems.init(
  {
    id: {
       type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      field: "ini_id",
    },
    invoiceId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "invoices", // tabla de cabecera
        key: "inv_id",
      },
      field: "ini_invoice_id",
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ini_cod_prod_id",
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "ini_description",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ini_quantity",
    },
    unitPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "ini_unit_price",
    },
    discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
      field: "ini_discount",
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      field: "ini_total",
    },
    taxRate: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 0,
      field: "ini_tax_rate",
    },
    taxAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      defaultValue: 0,
      field: "ini_tax_amount",
    },
    notes: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: "ini_notes",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "ini_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users", 
        key: "usr_id",
      },
      field: "ini_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "ini_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ini_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ini_last_upt",
    },
  },
  {
    sequelize,
    tableName: "invoices_items",
    timestamps: false,
  }
);

export default InvoicesItems;
