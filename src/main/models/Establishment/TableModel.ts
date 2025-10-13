import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
class Table extends Model {}

Table.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "tab_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "tab_name",
    },
    seats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "tab_seats",
    },
    locationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "loc_id",
      },
      field: "tab_location",
    },
    statusTab: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "tab_status_table",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "tab_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "tab_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "tab_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "tab_last_upt",
    },
  },
  {
    sequelize,
    tableName: "tables",
    timestamps: false,
  }
);

export default Table;