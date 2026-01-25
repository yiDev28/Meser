import { VITE_DEV_SERVER_URL } from "@/main/main";
import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let win: BrowserWindow | null = null;

export async function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      additionalArguments: ["--window=main"],
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  win.maximize();

  if (process.env.NODE_ENV === "development") {
    win.webContents.openDevTools();
  }

  // Tu lógica para la CSP se mantiene
 win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      "Content-Security-Policy": [
        app.isPackaged
          ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;"
          : "default-src 'self' http://localhost:5173 http://localhost:3000 https://*.supabase.co; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3000 https://*.supabase.co; img-src 'self' data: http://localhost:5173 http://localhost:3000 https://*.supabase.co; ",
      ],
    },
  });
});

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    const indexPath = path.join(app.getAppPath(), "dist", "index.html");
    win.loadFile(indexPath);
  }

  win.once("ready-to-show", () => win?.show());

  win.webContents.on("did-finish-load", () => {
    console.log("win HTML cargado");
  });
  win.webContents.on("did-fail-load", (_, code, desc) => {
    console.error("Error cargando win:", code, desc);
  });
}


export function closeWinMain() {
  win?.close();
  win = null;
}