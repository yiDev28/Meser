import "../env-init";
import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import "./ipc/registerApp";
import "./ipc/auth";
import "./ipc/order";
import "./ipc/paramOrder";
import "./ipc/invoice";
import "./ipc/cash";
import "./ipc/app"
import "./ipc/sync"
import "./ipc/config"
import { _initDb } from "./db/connection";
import { startServer } from "./server";
import { startPushWorker } from "./services/application/syncPushService";
import { downloadFromCloud } from "./services/supabase/syncPullService";
import { cleanupOldRecords } from "./services/application/cleanupService";
import { checkInternetConnection } from "./utils/network";
// import { autoUpdater } from "electron-updater";
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

  await Promise.all([
    (async () => {
      updateSplashMessage("Iniciando base de datos...");
      await _initDb();
    })(),
    (async () => {
      updateSplashMessage("Iniciando servidor...");
      startServer();
    })(),
  ]);

  const { initializeDefaultConfig, getConfigValue } = await import("./ipc/config");
  await initializeDefaultConfig();

  const windowOptions = {
    hideTitleBar: (await getConfigValue("hide_titlebar")) === "true",
    fullscreen: (await getConfigValue("fullscreen")) === "true",
    openDevTools: (await getConfigValue("open_devtools")) === "true",
    screenIndex: parseInt((await getConfigValue("screen_index")) || "0", 10),
  };

  const pushIntervalMs = parseInt((await getConfigValue("sync_push_interval_ms")) || "300000", 10);
  const pullIntervalMs = parseInt((await getConfigValue("sync_pull_interval_ms")) || "7200000", 10);

  updateSplashMessage("Verificando conexión...");
  const hasInternet = await checkInternetConnection();
  if (hasInternet) {
    updateSplashMessage("Iniciando sincronización...");
    
    startPushWorker(pushIntervalMs);
    
    setInterval(async () => {
      const isOnline = await checkInternetConnection();
      if (isOnline) {
        await downloadFromCloud();
      }
    }, pullIntervalMs);
  }

  const cleanupDays = parseInt((await getConfigValue("cleanup_days_to_keep")) || "7", 10);
  setTimeout(async () => {
    updateSplashMessage("Limpiando registros...");
    await cleanupOldRecords(cleanupDays);
  }, 2000);

  // autoUpdater.checkForUpdatesAndNotify();

  updateSplashMessage("Listo para comenzar!");
  closeSplash();
  await createWindow(windowOptions);
});
