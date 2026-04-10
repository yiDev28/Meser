import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";

class CleanupLog extends Model {}

CleanupLog.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      field: "cln_id",
    },
    tableName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "cln_table_name",
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: "cln_action",
    },
    recordsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "cln_records_count",
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "success",
      field: "cln_status",
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "cln_error_message",
    },
    executedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "cln_executed_at",
    },
  },
  {
    sequelize,
    tableName: "cleanup_logs",
    timestamps: false,
  }
);

export default CleanupLog;