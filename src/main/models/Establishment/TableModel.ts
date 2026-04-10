import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM, STATUS_TAB_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

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
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_TAB_ENUM.FREE,
      validate: {
        isIn: [Object.values(STATUS_TAB_ENUM)],
      },
      field: "tab_status_table",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "tab_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "tab_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "tab_scope",
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