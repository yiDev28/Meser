import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class Invoices extends Model {}

Invoices.init(
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
      type: DataTypes.INTEGER,
      allowNull: false,
       references: {
        model: "type_payment", 
        key: "tpy_id",
      },
      field: "inv_payment_method",
    },
    cashRegisterId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "cash_registers",
        key: "csr_id",
      },
      field: "inv_cash_register_id",
    },
    currency: {
      type: DataTypes.STRING(10),
      allowNull: true,
      defaultValue: "COP",
      field: "inv_currency",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "inv_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users", 
        key: "usr_id",
      },
      field: "inv_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "inv_scope",
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
    timestamps: false,
  }
);

export default Invoices;
