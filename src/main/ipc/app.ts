import { ipcMain, app } from "electron";
import { getMainWindow } from "../windows/main";

export interface WindowConfig {
  hideTitleBar: boolean;
  fullscreen: boolean;
  openDevTools: boolean;
  showMinimize: boolean;
  showMaximize: boolean;
  showClose: boolean;
  titleBarTitle: string;
}

ipcMain.handle("get-window-config", async (): Promise<WindowConfig> => {
  return {
    hideTitleBar: process.env.HIDE_TITLEBAR === "true",
    fullscreen: process.env.FULLSCREEN === "true",
    openDevTools: process.env.OPEN_DEVTOOLS === "true",
    showMinimize: process.env.SHOW_MINIMIZE !== "false",
    showMaximize: process.env.SHOW_MAXIMIZE !== "false",
    showClose: process.env.SHOW_CLOSE !== "false",
    titleBarTitle: process.env.TITLE_BAR_TITLE || "Meser",
  };
});

ipcMain.handle("exit-app", async () => {
    app.quit();
});

ipcMain.handle("minimize-window", async () => {
  const win = getMainWindow();
  win?.minimize();
});

ipcMain.handle("maximize-window", async () => {
  const win = getMainWindow();
  if (win?.isMaximized()) {
    win.unmaximize();
  } else {
    win?.maximize();
  }
});



ipcMain.handle("get-is-maximized", async () => {
  const win = getMainWindow();
  return win?.isMaximized() ?? false;
});