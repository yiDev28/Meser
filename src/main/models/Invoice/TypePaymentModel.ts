import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class TypePayment extends Model {}

TypePayment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "tpy_id",
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field:"tpy_code"
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "tpy_name",
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "tpy_description",
    },
    affectsCash: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
      field: "tpy_affects_cash",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "tpy_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "tpy_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "tpy_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "tpy_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "tpy_last_upt",
    },
  },
  {
    sequelize,
    tableName: "type_payment",
    timestamps: false,
  },
);

export default TypePayment;
