import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

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
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Activo, 0 = Inactivo
      field: "men_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: "usr_id",
      },
      field: "men_id_user",
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