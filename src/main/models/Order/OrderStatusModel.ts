import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";


class OrderStatus extends Model {}
class ItemOrdStatus extends Model {}

OrderStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "ost_id",
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "ost_name",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "ost_description",
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ost_sequence",
    },
    paramStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "ost_param_status",
    },
    paramPanel: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "ost_param_panel",
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "ost_completed",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ost_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "ost_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ost_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ost_last_upt",
    },
  },
  {
    sequelize,
    tableName: "order_statuses",
    timestamps: false,
  }
);

ItemOrdStatus.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "ois_id",
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "ois_name",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "ois_description",
    },
    sequence: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ois_sequence",
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "ois_completed",
    },
    paramStatus: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "ois_param_status",
    },
    changeStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      field: "ois_change_status",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "ois_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "ois_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ois_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ois_last_upt",
    },
  },
  {
    sequelize,
    tableName: "item_ord_statuses",
    timestamps: false,
  }
);

export { OrderStatus, ItemOrdStatus };
