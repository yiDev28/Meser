import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class SyncTime extends Model {}

SyncTime.init(
  {
    tableName: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      field: "syt_table_name",
    },
    lastSync: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "syt_last_sync",
    },
    status:{
      type:DataTypes.STRING,
      default: 'SUCCESS',
      field: "syt_status",
    },
    message:{
      type:DataTypes.STRING,
      allowNull: true,
      field: "syt_message",
    }
  },
  {
    sequelize,
    tableName: "sync_times", // Nombre de la tabla en la base de datos.
    timestamps: false, // Desactiva las marcas de tiempo automáticas de Sequelize.
  }
);

export default SyncTime;
