/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "./supabaseClient";
import { getLastSyncTime, saveLastSyncTime } from "./syncData";
import { syncModelsTables } from "@/main/utils/mapModelsTables";

export async function syncFromCloud(clientId: string) {
  for (const [
    key,
    { localModel, localTable, cloudTable, download },
  ] of Object.entries(syncModelsTables)) {
    if (!download) continue;

    const _table = localTable;
    try {
      const lastSyncTime = await getLastSyncTime(_table);

      // Detectar prefijo automáticamente desde el modelo local
      const attributes = localModel.rawAttributes;
      const sampleField = Object.values(attributes).find(
        (attr: any) =>
          typeof attr.field === "string" && attr.field.includes("_")
      ) as any;

      if (!sampleField)
        throw new Error(
          `No se pudo detectar prefijo para el modelo ${key} - ${localTable}`
        );

      const prefix = sampleField.field.split("_")[0] + "_";

      // Obtener lista de campos reales de la tabla
      const fields = Object.entries(attributes).map(
        ([attrName, attr]: [string, any]) => attr.field ?? attrName
      );

      //Campo de timestamp
      const updatedAtField = Object.values(attributes).find(
        (a) => (a as any).field && (a as any).field.endsWith("last_upt")
      ) ? (Object.values(attributes).find(
        (a) => (a as any).field && (a as any).field.endsWith("last_upt")
      ) as any).field : undefined;

      //Construir query base
      let query = supabase
        .from(cloudTable)
        .select(fields.join(","))
        .eq(`${prefix}client_id`, clientId);

      // Filtro incremental
      if (lastSyncTime && updatedAtField) {
        query = query.gte(updatedAtField, lastSyncTime);
      }

      // Ejecutar consulta
      const { data, error } = await query;
      if (error) throw error;

      // Procesar resultados (upsert)
      if (data && data.length > 0) {
        for (const remote of data) {
          const idField = (Object.values(attributes).find(
            (a: any) => a.primaryKey
          ) as any)?.field;
          const id = remote[idField];

          const localItem = await localModel.findByPk(id);

          const itemData: Record<string, any> = {};
          for (const [attrName, attr] of Object.entries(attributes)) {
            const fieldName = (attr as any).field ?? attrName;
            itemData[attrName] = remote[fieldName];
          }

          if (localItem) {
            await localItem.update(itemData);
          } else {
            await localModel.create(itemData);
          }
        }
      }

      await saveLastSyncTime(_table, "SUCCESS");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      await saveLastSyncTime(_table, "ERROR", errorMessage);
    }
  }
}
