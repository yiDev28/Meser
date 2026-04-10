import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class OrderDetail extends Model {}

OrderDetail.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, 
      primaryKey: true,
      field: "odt_id",
    },
    orderId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'orders',
        key: "ord_id",
      },
      field: "odt_order_id",
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "odt_sec",
    },
    menuItemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'menu_items',
        key: "mei_id",
      },
      field: "odt_menu_item_id",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "odt_quantity",
    },
    notes: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "odt_notes",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item_ord_statuses',
        key: "ois_id",
      },
      field: "odt_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "odt_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "odt_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "odt_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "odt_last_upt",
    },
  },
  {
    sequelize,
    tableName: "order_details",
    timestamps: false,
  }
);

export default OrderDetail;