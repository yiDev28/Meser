import "../env-init";
import { app, BrowserWindow, protocol } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "./ipc/registerApp";
import "./ipc/auth";
import "./ipc/order";
import "./ipc/paramOrder";
import "./ipc/invoice";
import "./ipc/app"
import { _initDb } from "./db/connection";
import { startServer } from "./server";
import { startSyncWorker } from "./services/application/syncQueue";
import { autoUpdater } from "electron-updater";
import { closeWinMain, createWindow } from "./windows/main";
import { closeSplash, createSplashWindow, updateSplashMessage } from "./windows/splash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, "..");
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    closeWinMain();
    app.quit();
  }
});

app.on("activate", async () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    await createWindow();
  }
});

app.whenReady().then(async () => {
  
  createSplashWindow();

  updateSplashMessage("Inicializando aplicación...");

  // Espera 5 segundos
  setTimeout(async () => {
    updateSplashMessage("Iniciando base de datos...");
    await _initDb();
  }, 1000);

  // Espera 10 segundos desde el inicio
  setTimeout(async () => {
    updateSplashMessage("Iniciando servidor...");
    startServer();
  }, 2000);

  // Espera 15 segundos desde el inicio
  setTimeout(async () => {
    updateSplashMessage("Iniciando sincronización...");
    startSyncWorker(1_800_000);

    updateSplashMessage("Listo para comenzar!");
    setTimeout(async () => {
      closeSplash();
      await createWindow();
    }, 1000);
  }, 3000);

  // Auto-update en paralelo
  autoUpdater.checkForUpdatesAndNotify();
});
