import { createRequire } from "node:module";
import path from "path";
import { app } from "electron";

const require = createRequire(import.meta.url);
const { Sequelize } = require("sequelize");

const DB_VERSION =  process.env.VERSION_APP ||"0.0.0";
const storagePath = path.join(app.getPath("userData"), `localdb_${DB_VERSION}.sqlite3`);
console.log("dirnameDb:", storagePath);
console.log("DB Version:", DB_VERSION);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});



export { sequelize };
