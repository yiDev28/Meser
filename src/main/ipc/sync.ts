import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import {
  getSyncStatus,
  getPendingSyncItems,
  retrySyncErrors,
  uploadPendingToCloud,
  uploadTableToCloud,
} from "../services/application/syncPushService";
import {
  downloadFromCloud,
  downloadTableFromCloud,
  getSyncModelsWithLastSync,
} from "../services/supabase/syncPullService";

ipcMain.handle("get-sync-models", async (): Promise<RESPONSE> => {
  try {
    return await getSyncModelsWithLastSync();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener modelos: " + error);
  }
});

ipcMain.handle("get-sync-status", async (): Promise<RESPONSE> => {
  try {
    return await getSyncStatus();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener estado: " + error);
  }
});

ipcMain.handle("get-pending-sync-items", async (): Promise<RESPONSE> => {
  try {
    return await getPendingSyncItems();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener pendientes: " + error);
  }
});

ipcMain.handle("sync-pull-all", async (): Promise<RESPONSE> => {
  try {
    return await downloadFromCloud();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en download: " + error);
  }
});

ipcMain.handle("sync-pull-table", async (_event, tableName: string): Promise<RESPONSE> => {
  try {
    return await downloadTableFromCloud(tableName);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en download table: " + error);
  }
});

ipcMain.handle("sync-push-pending", async (): Promise<RESPONSE> => {
  try {
    return await uploadPendingToCloud();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en upload: " + error);
  }
});

ipcMain.handle("sync-push-table", async (_event, tableName: string): Promise<RESPONSE> => {
  try {
    return await uploadTableToCloud(tableName);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en upload table: " + error);
  }
});

ipcMain.handle("retry-sync-errors", async (): Promise<RESPONSE> => {
  try {
    return await retrySyncErrors();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al reintentar: " + error);
  }
});
