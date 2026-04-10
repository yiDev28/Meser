import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";

class SyncQueue extends Model {}

SyncQueue.init(
  {
    recordId: {
      type: DataTypes.UUID,
      primaryKey: true,
      field: "syq_id",
    },

    tableName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
      field: "syq_table_name",
    },
    operation: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "insert",
      field: "syq_operation",
    },
    attempts: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "syq_attempts",
    },
    lastError: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "syq_last_error",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: SYNC_STATUS.PENDING,
      field: "syq_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "syq_id_user",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "syq_created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "syq_updated_at",
    },
  },
  {
    sequelize,
    tableName: "sync_queue",
    timestamps: false,
  }
);

export { SyncQueue };
