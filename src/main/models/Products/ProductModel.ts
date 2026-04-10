import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

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
    urlImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "pro_url_img",
    },
    imagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "pro_image_path",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "pro_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "pro_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "pro_scope",
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
