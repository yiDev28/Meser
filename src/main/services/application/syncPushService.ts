/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "node:module";
import { app } from "electron";
const require = createRequire(import.meta.url);
const { DataTypes } = require("sequelize");
import { SyncQueue } from "@/main/models/Shared/syncQueueModel";
import { supabase } from "../supabase/supabaseClient";
import { Client } from "@/main/models/Client/ClientModel";
import { Transaction, ModelAttributes, Model } from "sequelize";
import { syncModelsTables } from "@/main/utils/syncModelsConfig";
import { checkInternetConnection } from "@/main/utils/network";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import {
  SyncStatusDTO,
  PendingSyncItemDTO,
} from "@/interfaces/sync";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";

const MAX_ATTEMPTS = 3;

let pushTimer: NodeJS.Timeout | null = null;
let isPushRunning = false;

type SyncAction = "insert" | "update";

interface UpsertSyncQueueParams {
  tableName: string;
  recordId: string;
  action: SyncAction;
  userId: number;
}

interface MapOptions {
  clientId?: string;
  includeVirtuals?: boolean;
}

function resolveAction(
  currentAction: SyncAction,
  newAction: SyncAction
): SyncAction {
  if (currentAction === "insert" && newAction === "update") return "insert";
  return newAction;
}

function mapToDbFields<T extends Model>(
  modelInstance: T,
  options: MapOptions = {}
): Record<string, any> {
  const attributes = (modelInstance.constructor as typeof Model)
    .rawAttributes as ModelAttributes;

  const json = modelInstance.toJSON() as Record<string, any>;
  const mapped: Record<string, any> = {};

  for (const [attrName, value] of Object.entries(json)) {
    const attrDef = attributes[attrName];

    if (
      !options.includeVirtuals &&
      attrDef &&
      typeof attrDef === "object" &&
      "type" in attrDef &&
      attrDef.type instanceof DataTypes.VIRTUAL
    )
      continue;

    const fieldName =
      attrDef && typeof attrDef === "object" && "field" in attrDef
        ? (attrDef as { field?: string }).field || attrName
        : attrName;
    mapped[fieldName] = value;
  }

  if (options.clientId) {
    const firstAttr = Object.values(attributes)[0];
    let firstField: string | undefined;
    if (firstAttr && typeof firstAttr === "object" && "field" in firstAttr) {
      firstField = (firstAttr as { field?: string }).field;
    } else if (typeof firstAttr === "string") {
      firstField = firstAttr;
    }
    const prefixMatch = firstField?.match(/^([a-z]+)_/);
    const prefix = prefixMatch ? prefixMatch[1] + "_" : "";

    mapped[`${prefix}client_id`] = options.clientId;
  }

  return mapped;
}

async function processPendingRecords(limit: number = 100) {
  const pending = await SyncQueue.findAll({
    where: { status: SYNC_STATUS.PENDING },
    order: [["createdAt", "ASC"]],
    limit,
  });

  if (pending.length === 0) return;

  const client = await Client.findOne();
  if (!client) return;
  const clientId = client.id;

  for (const row of pending) {
    const tableName = row.tableName as keyof typeof syncModelsTables;
    const localRecord = await syncModelsTables[tableName].localModel.findByPk(
      row.recordId
    );
    const remoteTable = syncModelsTables[tableName].cloudTable;

    if (!localRecord) {
      await row.update({
        status: SYNC_STATUS.ERROR,
        lastError: "Registro local no encontrado",
        attempts: row.attempts + 1,
      });
      continue;
    }

    try {
      const attributes = (localRecord.constructor as typeof Model).rawAttributes;
      const pkField = Object.values(attributes).find((a: any) => a.primaryKey)?.field || "id";
      
      const payload = mapToDbFields(localRecord, { clientId: clientId });
      
      const { error } = await supabase.from(remoteTable).upsert([payload], {
        onConflict: pkField,
      });
      
      if (error) throw error;

      await row.destroy();
    } catch (err: any) {
      const newAttempts = row.attempts + 1;
      if (newAttempts >= MAX_ATTEMPTS) {
        await row.update({
          attempts: newAttempts,
          lastError: err.message ?? String(err),
          status: SYNC_STATUS.ERROR,
        });
      } else {
        await row.update({
          attempts: newAttempts,
          lastError: err.message ?? String(err),
          status: SYNC_STATUS.PENDING,
        });
      }
    }
  }
}

function stopPushWorker() {
  if (pushTimer) {
    clearInterval(pushTimer);
    pushTimer = null;
  }
}

export function startPushWorker(intervalMs: number = 300000) {
  if (pushTimer) return;

  const run = async () => {
    if (isPushRunning) return;
    isPushRunning = true;
    try {
      const hasInternet = await checkInternetConnection();
      if (!hasInternet) return;
      await processPendingRecords();
    } catch (err) {
      console.error("Push worker error:", err);
    } finally {
      isPushRunning = false;
    }
  };

  run();
  pushTimer = setInterval(run, intervalMs);

  app.once("before-quit", stopPushWorker);
}

export async function upsertSyncQueue(
  params: UpsertSyncQueueParams,
  transaction: Transaction
): Promise<typeof SyncQueue> {
  const { tableName, recordId, action, userId } = params;

  const existing = await SyncQueue.findOne({
    where: { tableName, recordId: recordId },
    transaction,
  });

  if (existing) {
    existing.operation = resolveAction(
      existing.operation as SyncAction,
      action
    );
    existing.status = SYNC_STATUS.PENDING;
    existing.attempts = 0;
    existing.lastError = null;
    existing.userId = userId;
    await existing.save({ transaction });
    return existing;
  } else {
    return await SyncQueue.create(
      {
        recordId: recordId,
        tableName,
        operation: action,
        status: SYNC_STATUS.PENDING,
        attempts: 0,
        lastError: null,
        userId,
      },
      { transaction }
    );
  }
}

export async function getSyncStatus(): Promise<RESPONSE<SyncStatusDTO>> {
  try {
    const isOnline = await checkInternetConnection();
    const pendingItems = await SyncQueue.findAll({
      where: { status: SYNC_STATUS.PENDING },
    });
    const errorItems = await SyncQueue.findAll({
      where: { status: SYNC_STATUS.ERROR },
    });

    return NEW_RESPONSE(0, "", {
      isOnline,
      pendingErrorCount: errorItems.length,
      pendingTotalCount: pendingItems.length + errorItems.length,
    });
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener estado de sync: " + error);
  }
}

export async function getPendingSyncItems(): Promise<RESPONSE<PendingSyncItemDTO[]>> {
  try {
    const items = await SyncQueue.findAll({
      where: {
        [require("sequelize").Op.or]: [
          { status: SYNC_STATUS.PENDING },
          { status: SYNC_STATUS.ERROR }
        ]
      },
      order: [["createdAt", "ASC"]],
    });

    const result: PendingSyncItemDTO[] = items.map((item: typeof SyncQueue.prototype) => ({
      tableName: item.tableName,
      recordId: item.recordId,
      operation: item.operation,
      attempts: item.attempts,
      status: item.status,
      createdAt: String(item.createdAt),
    }));

    return NEW_RESPONSE(0, "", result);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al obtener pendientes: " + error);
  }
}

export async function retrySyncErrors(): Promise<RESPONSE<{ retried: number }>> {
  try {
    const errors = await SyncQueue.findAll({
      where: { status: SYNC_STATUS.ERROR },
    });

    for (const row of errors) {
      await row.update({
        status: SYNC_STATUS.PENDING,
        attempts: 0,
        lastError: null,
      });
    }

    return NEW_RESPONSE(0, `${errors.length} registros reintentados`);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al reintentar: " + error);
  }
}

export async function uploadPendingToCloud(): Promise<RESPONSE<{ synced: number }>> {
  try {
    const isOnline = await checkInternetConnection();
    if (!isOnline) {
      return NEW_RESPONSE(1, "Sin conexión a internet");
    }

    await processPendingRecords();
    
    const pendingAfter = await SyncQueue.count({
      where: { status: SYNC_STATUS.PENDING },
    });
    const errorsAfter = await SyncQueue.count({
      where: { status: SYNC_STATUS.ERROR },
    });

    return NEW_RESPONSE(0, "Sincronización completada", {
      synced: pendingAfter + errorsAfter,
    });
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en upload pending: " + error);
  }
}

export async function uploadTableToCloud(tableName: string): Promise<RESPONSE<{ synced: number }>> {
  try {
    const isOnline = await checkInternetConnection();
    if (!isOnline) {
      return NEW_RESPONSE(1, "Sin conexión a internet");
    }

    if (!syncModelsTables[tableName]) {
      return NEW_RESPONSE(1, `Tabla ${tableName} no encontrada en configuración`);
    }

    const pending = await SyncQueue.findAll({
      where: { tableName, status: SYNC_STATUS.PENDING },
      order: [["createdAt", "ASC"]],
    });

    if (pending.length === 0) {
      return NEW_RESPONSE(0, "No hay registros pendientes para esta tabla");
    }

    const client = await Client.findOne();
    if (!client) {
      return NEW_RESPONSE(1, "Cliente no encontrado");
    }
    const clientId = client.id;
    let syncedCount = 0;

    for (const row of pending) {
      const localRecord = await syncModelsTables[tableName].localModel.findByPk(
        row.recordId
      );
      const remoteTable = syncModelsTables[tableName].cloudTable;

      if (!localRecord) {
        await row.update({
          status: SYNC_STATUS.ERROR,
          lastError: "Registro local no encontrado",
          attempts: row.attempts + 1,
        });
        continue;
      }

      try {
        const attributes = (localRecord.constructor as typeof Model).rawAttributes;
        const pkField = Object.values(attributes).find((a: any) => a.primaryKey)?.field || "id";
        
        const payload = mapToDbFields(localRecord, { clientId: clientId });
        
        const { error } = await supabase.from(remoteTable).upsert([payload], {
          onConflict: pkField,
        });
        
        if (error) throw error;

        await row.destroy();
        syncedCount++;
      } catch (err: any) {
        const newAttempts = row.attempts + 1;
        if (newAttempts >= MAX_ATTEMPTS) {
          await row.update({
            attempts: newAttempts,
            lastError: err.message ?? String(err),
            status: SYNC_STATUS.ERROR,
          });
        } else {
          await row.update({
            attempts: newAttempts,
            lastError: err.message ?? String(err),
            status: SYNC_STATUS.PENDING,
          });
        }
      }
    }

    return NEW_RESPONSE(0, `${syncedCount} registros subidos`, { synced: syncedCount });
  } catch (error) {
    return NEW_RESPONSE(-1, "Error en upload table: " + error);
  }
}
