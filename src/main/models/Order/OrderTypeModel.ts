import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class OrderType extends Model {}

OrderType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "ort_id",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "ort_name",
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: "ort_description",
    },
    colorLabel: {
      type: DataTypes.STRING(10),
      allowNull: true,
      field: "ort_color_label",
    },
    paramType: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: "ort_param_type",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "ort_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "ort_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "ort_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ort_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "ort_last_upt",
    },
  },
  {
    sequelize,
    tableName: "order_types",
    timestamps: false,
  }
);

export default OrderType;
