import { createRequire } from "node:module";
import path from "path";
import { app } from "electron";

// Usamos createRequire para manejar la importación de módulos nativos como sqlite3 y sequelize
const require = createRequire(import.meta.url);
const { Sequelize } = require("sequelize");

const storagePath = path.join(app.getPath("userData"), "localdbinit.sqlite3");
console.log("dirnameDb:", storagePath);

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: storagePath,
  logging: false,
});



export { sequelize };
