import SyncTime from "../../models/Shared/SyncTimeModel";
import { syncClientData } from "./clientService";
import { syncFromCloud } from "./syncFromCloud";

export async function syncDataCloud(clientId: string) {
  await syncClientData(clientId);
  await syncFromCloud(clientId);
}

export const getLastSyncTime = async (
  tableName: string
): Promise<string | null> => {
  const syncRecord = await SyncTime.findByPk(tableName);
  return syncRecord ? syncRecord.lastSync : null;
};

export const saveLastSyncTime = async (
  tableName: string,
  status: string,
  error?: string
) => {
  const newTimestamp = new Date().toISOString();
  if (status === "ERROR") {
    const localItem = await SyncTime.findByPk(tableName);
    if (localItem) {
      const data = {
        tableName: tableName,
        lastSync: localItem.dataValues.lastSync,
        status: status,
        message: error,
      };
      await SyncTime.upsert(data);
    } else {
      await SyncTime.create({
        tableName: tableName,
        lastSync: "",
        status: status,
        message: error,
      });
    }
  } else {
    await SyncTime.upsert({
      tableName: tableName,
      lastSync: newTimestamp,
      status: status,
      message: "OK",
    });
  }
  console.log(
    `Marca de tiempo de sincronización actualizada para ${tableName}: ${newTimestamp}`
  );
};
