import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";

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
      default: SYNC_STATUS.SUCCESS,
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
    tableName: "sync_times",
    timestamps: false,
  }
);

export default SyncTime;
