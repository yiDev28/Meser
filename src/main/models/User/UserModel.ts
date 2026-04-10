import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class User extends Model {}

User.init(
  {

    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "usr_id",
    },
    username: {
      type: DataTypes.TEXT,
      unique: true,
      field: "usr_user",
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "usr_name",
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "usr_password",
    },
    changePassword: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Sí, 0 = No
      field: "usr_change_pass",
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "usr_role",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "usr_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "usr_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "usr_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "usr_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "usr_last_upt",
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);

export default User;
