/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "node:module";
import { app } from "electron";
const require = createRequire(import.meta.url);
const { DataTypes } = require("sequelize");
import { SyncQueue } from "@/main/models/Shared/syncQueueModel";
import { supabase } from "../supabase/supabaseClient";
import { Client } from "@/main/models/Client/ClientModel";
import { Transaction, ModelAttributes, Model } from "sequelize";
import { syncModelsTables } from "@/main/utils/mapModelsTables";
import { checkInternetConnection } from "@/main/utils/network";

let timer: NodeJS.Timeout | null = null;
let isRunning = false;

type SyncAction = "insert" | "update";

interface UpsertSyncQueueParams {
  tableName: string;
  recordId: string;
  action: SyncAction; // acción deseada
  userId: number;
}

interface MapOptions {
  clientId?: string; // UUID del cliente (opcional)
  includeVirtuals?: boolean;
}

function resolveAction(
  currentAction: SyncAction,
  newAction: SyncAction
): SyncAction {
  // Si ya era insert y ahora update → sigue insert
  if (currentAction === "insert" && newAction === "update") return "insert";
  // Delete siempre prevalece
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

    // Omitir campos virtuales, salvo que se solicite explícitamente
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

  // ---  Agregar client_id con prefijo dinámico ---
  if (options.clientId) {
    // Tomamos el prefijo del primer campo real del modelo (ej: "ord_", "odt_")
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

async function syncPendingRecords(limit: number = 100) {
  const pending = await SyncQueue.findAll({
    where: { status: "pending" },
    order: [["createdAt", "ASC"]],
    limit,
  });

  if (pending.length === 0) return;

  const clientId = await Client.findOne();

  for (const row of pending) {
    const tableName = row.tableName as keyof typeof syncModelsTables;
    const localRecord = await syncModelsTables[tableName].localModel.findByPk(
      row.recordId
    );
    const remoteTable = syncModelsTables[tableName].cloudTable;

    if (!localRecord) {
      // registro local borrado? marcar error o borrar
      await row.update({
        status: "error",
        lastError: "Registro local no encontrado",
        attempts: row.attempts + 1,
      });
      continue;
    }

    try {
      if (row.operation === "insert") {
        const payload = mapToDbFields(localRecord, { clientId: clientId.id });
        const { error } = await supabase.from(remoteTable).insert([payload]);
        if (error) throw error;
      } else if (row.operation === "update") {
        const payload = mapToDbFields(localRecord, { clientId: clientId.id });

        const pkField =
          Object.values(
            (localRecord.constructor as typeof Model).rawAttributes
          ).find((a: any) => a.primaryKey)?.field || "id";

        const { error } = await supabase
          .from(remoteTable)
          .update(payload)
          .eq(pkField, row.recordId);
        if (error) throw error;
      }

      // Si todo bien, marcar como done o borrar
      await row.destroy();
    } catch (err: any) {
      await row.update({
        attempts: row.attempts + 1,
        lastError: err.message ?? String(err),
        status: "pending", // puedes poner 'error' si quieres suspender
      });
    }
  }
}

function stopSyncWorker() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

export function startSyncWorker(intervalMs: number = 1_800_000) {
  if (timer) return; // ya iniciado

  const run = async () => {
    if (isRunning) return;
    isRunning = true;
    try {
      const hasInternet = await checkInternetConnection();
      if (!hasInternet) return;
      await syncPendingRecords();
    } catch (err) {
      console.error("syncWorker error:", err);
    } finally {
      isRunning = false;
    }
  };

  // Ejecutar de inmediato y luego en intervalo
  run();
  timer = setInterval(run, intervalMs);

  // cuando la app se está cerrando, detener
  app.once("before-quit", stopSyncWorker);
}

export async function upsertSyncQueue(
  params: UpsertSyncQueueParams,
  transaction: Transaction
): Promise<typeof SyncQueue> {
  const { tableName, recordId, action, userId } = params;

  // Buscar registro existente dentro de la misma transacción
  const existing = await SyncQueue.findOne({
    where: { tableName, recordId: recordId },
    transaction,
  });

  if (existing) {
    // Actualizar con la acción efectiva (insert/update)
    existing.operation = resolveAction(
      existing.operation as SyncAction,
      action
    );
    existing.status = "pending";
    existing.attempts = 0;
    existing.lastError = null;
    existing.userId = userId;
    await existing.save({ transaction });
    return existing;
  } else {
    // Crear nuevo registro en la cola
    return await SyncQueue.create(
      {
        recordId: recordId,
        tableName,
        operation: action,
        status: "pending",
        attempts: 0,
        lastError: null,
        userId,
      },
      { transaction }
    );
  }
}
