import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

class Menu extends Model {}

Menu.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "men_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "men_name",
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: "men_description",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "men_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "men_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "men_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "men_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "men_last_upt",
    },
  },
  {
    sequelize,
    tableName: "menus",
    timestamps: false,
  }
);

export default Menu;