import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class ProductCategory extends Model {}

ProductCategory.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "pdc_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "pdc_name",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Activo, 0 = Inactivo
      field: "pdc_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "pdc_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "pdc_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "pdc_last_upt",
    },
  },
  {
    sequelize,
    tableName: "product_categories",
    timestamps: false,
  }
);

export default ProductCategory;
