import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Model, DataTypes } = require("sequelize");
import { sequelize } from "../../db/db";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";

/* =========================
   PARAMETER
========================= */
class Parameter extends Model {}

Parameter.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "par_id",
    },
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      field: "par_code",
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: "par_name",
    },
    description: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: "par_description",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "par_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "par_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "par_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "par_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "par_last_upt",
    },
  },
  {
    sequelize,
    tableName: "parameter",
    timestamps: false,
  },
);

/* =========================
   PARAMETER SCOPE
 ========================= */
class ParameterScope extends Model {}

ParameterScope.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "psc_id",
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      field: "psc_code",
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      field: "psc_name",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "psc_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "psc_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "psc_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "psc_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "psc_last_upt",
    },
  },
  {
    sequelize,
    tableName: "parameter_scope",
    timestamps: false,
  },
);

/* =========================
   PARAMETER VALUE
 ========================= */
class ParameterValue extends Model {}

ParameterValue.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      field: "prv_id",
    },
    parameterId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "parameter",
        key: "par_id",
      },
      field: "prv_par_id",
    },
    scopeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "parameter_scope",
        key: "psc_id",
      },
      field: "prv_psc_id",
    },
    scopeRefId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "prv_scope_ref_id",
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "prv_value",
    },
    valueType: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "prv_value_type",
    },
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: STATUS_ENUM.ACTIVE,
      validate: {
        isIn: [Object.values(STATUS_ENUM)],
      },
      field: "prv_status",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "prv_id_user",
    },
    scope: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: SCOPE_ENUM.CLIENT,
      validate: {
        isIn: [Object.values(SCOPE_ENUM)],
      },
      field: "prv_scope",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "prv_create_dat",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "prv_last_upt",
    },
  },
  {
    sequelize,
    tableName: "parameter_value",
    timestamps: false,
  },
);

/* =========================
   RELATIONSHIPS
========================= */
// Parameter.hasMany(ParameterValue, {
//   foreignKey: "prv_par_id",
// });

// ParameterValue.belongsTo(Parameter, {
//   foreignKey: "prv_par_id",
// });

// ParameterScope.hasMany(ParameterValue, {
//   foreignKey: "prv_psc_id",
// });

// ParameterValue.belongsTo(ParameterScope, {
//   foreignKey: "prv_psc_id",
// });

/* =========================
   EXPORTS
========================= */
export { Parameter, ParameterScope, ParameterValue };
