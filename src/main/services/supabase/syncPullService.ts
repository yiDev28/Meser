import SyncTime from "../../models/Shared/SyncTimeModel";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";
import { syncClientData } from "./clientService";
import { executeSyncFromCloud } from "./syncPullExecutor";
import { syncModelsTables } from "@/main/utils/syncModelsConfig";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { SyncModelDTO } from "@/interfaces/sync";
import { Client } from "@/main/models/Client/ClientModel";

export async function syncDataCloud(clientId: string) {
  await syncClientData(clientId);
  await executeSyncFromCloud(clientId);
}

export async function downloadFromCloud(): Promise<RESPONSE> {
  try {
    const client = await Client.findOne();
    if (!client) {
      return NEW_RESPONSE(1, "Cliente no encontrado");
    }

    await syncClientData(client.id);
    await executeSyncFromCloud(client.id);

    return NEW_RESPONSE(0, "Descarga desde nube completada");
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en download from cloud: " + error);
  }
}

export async function downloadTableFromCloud(tableName: string): Promise<RESPONSE> {
  try {
    const client = await Client.findOne();
    if (!client) {
      return NEW_RESPONSE(1, "Cliente no encontrado");
    }

    if (!syncModelsTables[tableName]) {
      return NEW_RESPONSE(1, `Tabla ${tableName} no encontrada en configuración`);
    }

    const config = syncModelsTables[tableName];
    if (!config.download) {
      return NEW_RESPONSE(1, `La tabla ${tableName} no está configurada para descarga`);
    }

    await executeSyncFromCloud(client.id, tableName);

    return NEW_RESPONSE(0, `Descarga de ${tableName} completada`);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en download table: " + error);
  }
}

export async function getSyncModelsWithLastSync(): Promise<RESPONSE<SyncModelDTO[]>> {
  try {
    const models: SyncModelDTO[] = [];

    for (const [localTable, config] of Object.entries(syncModelsTables)) {
      if (!config.download) continue;

      const syncRecord = await SyncTime.findByPk(localTable);

      models.push({
        tableName: localTable,
        cloudTable: config.cloudTable,
        lastSync: syncRecord?.lastSync || null,
        syncStatus: (syncRecord?.status as SYNC_STATUS) || null,
        syncMessage: syncRecord?.message || null,
      });
    }

    return NEW_RESPONSE(0, "", models);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener modelos: " + error);
  }
}

export const getLastSyncTime = async (
  tableName: string
): Promise<string | null> => {
  const syncRecord = await SyncTime.findByPk(tableName);
  return syncRecord ? syncRecord.lastSync : null;
};

export const saveLastSyncTime = async (
  tableName: string,
  syncStatus: SYNC_STATUS,
  error?: string
) => {
  const newTimestamp = new Date().toISOString();
  if (syncStatus === SYNC_STATUS.ERROR) {
    const localItem = await SyncTime.findByPk(tableName);
    if (localItem) {
      const data = {
        tableName: tableName,
        lastSync: localItem.dataValues.lastSync,
        status: syncStatus,
        message: error,
      };
      await SyncTime.upsert(data);
    } else {
      await SyncTime.create({
        tableName: tableName,
        lastSync: "",
        status: syncStatus,
        message: error,
      });
    }
  } else {
    await SyncTime.upsert({
      tableName: tableName,
      lastSync: newTimestamp,
      status: syncStatus,
      message: "OK",
    });
  }
  console.log(
    `Marca de tiempo de sincronización actualizada para ${tableName}: ${newTimestamp}`
  );
};
