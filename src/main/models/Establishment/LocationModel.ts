import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class Location extends Model {}

Location.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "loc_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "loc_name",
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: "loc_description",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Activo, 0 = Inactivo
      field: "loc_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "loc_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "loc_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "loc_last_upt",
    },
  },
  {
    sequelize,
    tableName: "locations",
    timestamps: false,
  }
);

export default Location;