import { VITE_DEV_SERVER_URL } from "@/main/main";
import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

  // ✅ HTML inline (no archivo externo)
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            background-color: #1e1e1e;
            color: white;
            font-family: sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
          }
        </style>
      </head>
      <body>
        <div id="status">Inicializando...</div>
        <script>
  window.splashAPI.onUpdate((msg) => {
    document.getElementById('status').textContent = msg;
  });
</script>
      </body>
    </html>
  `;

  // Cargar el HTML directamente como Data URL
  splash.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);

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
