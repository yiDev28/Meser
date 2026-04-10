/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import MenuItem from "../Menu/MenuItemModel";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class Order extends Model {}

Order.init(
  {
     id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      field: "ord_id",
    },
    localNumber: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      field: "ord_local_id",
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ord_cus_id",
    },
    guestCustId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "guest_customer",
        key: "gcu_id",
      },
      field: "ord_guest_cus_id",
    },
    subTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "ord_subtotal",
    },
    chargesTotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "ord_charges_total",
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "ord_total",
    },
    //Campo virtual
    totalV: {
      type: DataTypes.VIRTUAL,
      get(): number {
        const items = (this as any).get("items") || [];
        return items.reduce((acc: number, item: MenuItem) => {
          if (item.itemStatus.paramStatus === "CANCELED") {
            return acc; // mantenemos el acumulador
          } else {
            const price = item.menuItem?.price ?? 0;
            const qty = item.quantity ?? 1;
            return acc + price * qty;
          }
        }, 0);
      },
    },
    orderType: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order_types",
        key: "ort_id",
      },
      field: "ord_type",
    },
    tableNumber: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "tables",
        key: "tab_id",
      },
      field: "ord_table_id",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order_statuses",
        key: "ost_id",
      },
      field: "ord_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ord_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "ord_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ord_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ord_last_upt",
    },
  },
  {
    sequelize,
    tableName: "orders",
    timestamps: false,
  }
);

export default Order;
