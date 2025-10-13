import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "@/main/db/db";

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
      field: "syq_table_name",
    },
    operation: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "insert",
      field: "syq_operation",
    },
    attempts: {
      // número de intentos de sincronización
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "syq_attempts",
    },
    lastError: {
      // último error si falló
      type: DataTypes.TEXT,
      allowNull: true,
      field: "syq_last_error",
    },
    status: {
      // pending, success, error
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      field: "syq_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "usr_id",
      },
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
    timestamps: false, // usamos nuestros propios campos
  }
);

export { SyncQueue };
