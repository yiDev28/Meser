import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class Product extends Model {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "pro_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "pro_name",
    },
    description: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "pro_description",
    },
    category: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "product_categories",
        key: "pdc_id",
      },
      field: "pro_category",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "pro_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "pro_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "pro_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "pro_last_upt",
    },
  },
  {
    sequelize,
    tableName: "products",
    timestamps: false,
  }
);

export default Product;
