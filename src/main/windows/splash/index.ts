import { app, BrowserWindow } from "electron";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Rutas para desarrollo y producción
const devBase = path.join(process.cwd(), "src", "main", "windows", "splash");
const prodBase = app.isPackaged
  ? path.join(process.resourcesPath, "splash")
  : __dirname;

const devIndexHtml = path.join(devBase, "index.html");
const prodIndexHtml = path.join(prodBase, "index.html");
const indexHtmlPath = fs.existsSync(devIndexHtml)
  ? devIndexHtml
  : prodIndexHtml;

let splash: BrowserWindow | null = null;

export function createSplashWindow() {
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    backgroundColor: "#1e1e1e",
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      additionalArguments: ["--window=splash"],
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Si existe index.html, cargarlo directamente (permite rutas relativas a archivos locales)
    try {
      splash.loadFile(indexHtmlPath);
    } catch (err) {
      console.warn(
        "Error cargando index.html con loadFile, intentando file:// URL. Error:",
        err
      );
      splash.loadURL(pathToFileURL(indexHtmlPath).toString());
    }
  
  splash.once("ready-to-show", () => splash?.show());

  splash.webContents.on("did-finish-load", () => {
    console.log("✅ Splash HTML cargado");
  });
  splash.webContents.on("did-fail-load", (_, code, desc) => {
    console.error("❌ Error cargando splash:", code, desc);
  });
}

export function updateSplashMessage(message: string) {
  splash?.webContents.send("splash-update", message);
}

export function closeSplash() {
  splash?.close();
  splash = null;
}
