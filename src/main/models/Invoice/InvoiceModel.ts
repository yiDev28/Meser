import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class Invoice extends Model {}

Invoice.init(
  {
    id: {
       type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      field: "inv_id",
    },
    number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "inv_number",
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "orders", // tabla res_orders
        key: "ord_id",
      },
      field: "inv_order_id",
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "customer", // tabla res_guest_customer
        key: "cus_id",
      },
      field: "inv_customer_id",
    },
    subtotal: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "inv_subtotal",
    },
    tip: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "inv_tip",
    },
    tax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "inv_tax",
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
      field: "inv_total",
    },
    paymentMethod: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "inv_payment_method",
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "COP",
      field: "inv_currency",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "inv_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users", // tabla res_users
        key: "usr_id",
      },
      field: "inv_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "inv_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "inv_last_upt",
    },
  },
  {
    sequelize,
    tableName: "invoices",
    timestamps: false, // usamos nuestros propios campos
  }
);

export default Invoice;
