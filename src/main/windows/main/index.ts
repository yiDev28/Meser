import { VITE_DEV_SERVER_URL } from "@/main/main";
import { app, BrowserWindow, screen } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getIconPath = (): string => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, "icon.ico");
  }
  return path.join(process.env.VITE_PUBLIC ?? "public", "icon.ico");
};

interface WindowOptions {
  hideTitleBar?: boolean;
  fullscreen?: boolean;
  openDevTools?: boolean;
  screenIndex?: number;
}

let win: BrowserWindow | null = null;

export async function createWindow(options: WindowOptions = {}) {
  const hideTitleBar = options.hideTitleBar ?? false;
  const fullscreen = options.fullscreen ?? false;
  const openDevTools = options.openDevTools ?? false;
  const screenIndex = options.screenIndex ?? 0;

  const displays = screen.getAllDisplays();
  const targetDisplay = displays[screenIndex] || displays[0];

  win = new BrowserWindow({
    icon: getIconPath(),
    frame: !hideTitleBar,
    titleBarStyle: hideTitleBar ? "hidden" : "default",
    fullscreen: fullscreen,
    x: targetDisplay?.bounds.x,
    y: targetDisplay?.bounds.y,
    width: targetDisplay?.bounds.width,
    height: targetDisplay?.bounds.height,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      additionalArguments: ["--window=main"],
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (hideTitleBar) {
    win.setMenu(null);
  }

  if (win && !fullscreen) {
    win.maximize();
  } else if (win && fullscreen) {
    win.setFullScreen(true);
  }

  win.once("ready-to-show", () => {
    win?.show();
    if (openDevTools) {
      win?.webContents.openDevTools();
    }
  });

  // Tu lógica para la CSP se mantiene
 win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
  callback({
    responseHeaders: {
      ...details.responseHeaders,
      "Content-Security-Policy": [
        app.isPackaged
          ? "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:;"
          : "default-src 'self' http://localhost:5173 http://localhost:3050 https://*.supabase.co; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' http://localhost:3050 https://*.supabase.co; img-src 'self' data: http://localhost:5173 http://localhost:3050 https://*.supabase.co; ",
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

export function getMainWindow(): BrowserWindow | null {
  return win;
}

export function updateWindowPosition(index: number): void {
  if (!win) return;
  
  const displays = screen.getAllDisplays();
  const targetDisplay = displays[index];
  
  if (targetDisplay) {
    win.setBounds(targetDisplay.bounds);
  }
}