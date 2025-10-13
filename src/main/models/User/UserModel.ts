import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Activo, 0 = Inactivo
      field: "usr_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "usr_id_user",
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
    timestamps: false, // Evita que Sequelize agregue 'createdAt' y 'updatedAt'
  }
);

export default User;
