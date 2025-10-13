import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";

class Customer extends Model {}
class GuestCustomer extends Model {}

Customer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "cus_id",
    },
    tipIdent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cus_tip_ident",
    },
    numIdent: {
      type: DataTypes.STRING(25),
      allowNull: false,
      field: "cus_num_ident",
    },
    fullName: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "cus_full_name",
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "cus_phone",
    },
    email: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "cus_email",
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: false,
      field: "cus_address",
    },
    codCity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "cus_cod_city",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "cus_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "cus_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "cus_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "cus_last_upt",
    },
  },
  {
    sequelize,
    tableName: "customer",
    timestamps: false,
  }
);

GuestCustomer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "gcu_id",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "gcu_name",
    },
    phone: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
      field: "gcu_phone",
    },
    address: {
      type: DataTypes.STRING(250),
      allowNull: true,
      field: "gcu_address",
    },
    codCity: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "gcu_cod_city",
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: "gcu_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "usr_id",
      },
      field: "gcu_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "gcu_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "gcu_last_upt",
    },
  },
  {
    sequelize,
    tableName: "guest_customer",
    timestamps: false,
  }
);

export  {Customer,GuestCustomer};
