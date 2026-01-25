import { ipcMain } from "electron";

ipcMain.handle("exit-app", async () => {
    process.exit(0);

});