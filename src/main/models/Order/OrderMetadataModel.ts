/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class OrderMetadata extends Model {}

OrderMetadata.init(
  {
    orderId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "omt_id_order",
      references: {
        model: "orders",
        key: "ord_id",
      },
    },
    nameCustomer: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: "omt_name_customer",
    },
    notesOrder: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "omt_notes_order",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "omt_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "omt_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "omt_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "omt_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "omt_last_upt",
    },
  },
  {
    sequelize,
    tableName: "order_metadata",
    timestamps: false,
  },
);

export default OrderMetadata;
