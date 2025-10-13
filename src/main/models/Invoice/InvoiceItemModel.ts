import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class InvoiceItem extends Model {}

InvoiceItem.init(
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
      allowNull: false,
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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "ini_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users", // tabla res_users
        key: "usr_id",
      },
      field: "ini_id_user",
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
    tableName: "invoice_items",
    timestamps: false,
  }
);

export default InvoiceItem;
