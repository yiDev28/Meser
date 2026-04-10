import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

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
    urlImage: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "pdc_url_img",
    },
    imagePath: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: "pdc_image_path",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "pdc_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "pdc_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "pdc_scope",
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
