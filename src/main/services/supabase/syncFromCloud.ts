/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "./supabaseClient";
import { getLastSyncTime, saveLastSyncTime } from "./syncData";
import { syncModelsTables } from "@/main/utils/mapModelsTables";
import { downloadAndSaveImage, FOLDER_NAMES } from "@/main/services/shared/files";

const IMG_FOLDERS: Record<string, string> = {
  client: FOLDER_NAMES.CLIENT_LOGOS,
  product_categories: FOLDER_NAMES.CATEGORIES_IMAGES,
  products: FOLDER_NAMES.PRODUCTS_IMAGES,
};

function extractFileName(url: string): string {
  const parts = url.split("/");
  return parts[parts.length - 1] || "image";
}

export async function syncFromCloud(clientId: string) {
  for (const [
    key,
    { localModel, localTable, cloudTable, download, paramGlobal, paramClient, imgLocal },
  ] of Object.entries(syncModelsTables)) {
    if (!download) continue;

    const shouldDownloadGlobal = paramGlobal === true;
    const shouldDownloadClient = paramClient === true;

    if (!shouldDownloadGlobal && !shouldDownloadClient) continue;

    const _table = localTable;
    try {
      const lastSyncTime = await getLastSyncTime(_table);

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

      const fields = Object.entries(attributes)
        .filter(([attrName]) => {
          if (imgLocal === true) {
            const isClient = key === "client";
            if (isClient) {
              return attrName !== "logoPath";
            }
            return attrName !== "imagePath";
          }
          return true;
        })
        .map(([attrName, attr]: [string, any]) => attr.field ?? attrName);

      const updatedAtField = Object.values(attributes).find(
        (a) => (a as any).field && (a as any).field.endsWith("last_upt")
      )
        ? (
            Object.values(attributes).find(
              (a) => (a as any).field && (a as any).field.endsWith("last_upt")
            ) as any
          ).field
        : undefined;

      let query = supabase.from(cloudTable).select(fields.join(","));

      if (shouldDownloadGlobal && shouldDownloadClient) {
        query = query.or(
          `${prefix}scope.eq.GLOBAL,${prefix}client_id.eq.${clientId}`
        );
      } else if (shouldDownloadGlobal) {
        query = query.eq(`${prefix}scope`, "GLOBAL");
      } else if (shouldDownloadClient) {
        query = query.eq(`${prefix}client_id`, clientId);
      }

      if (lastSyncTime && updatedAtField) {
        query = query.gte(updatedAtField, lastSyncTime);
      }

      const { data, error } = await query;
      if (error) throw error;

      if (data && data.length > 0) {
        for (const remote of data) {
          const idField = (
            Object.values(attributes).find(
              (a: any) => a.primaryKey
            ) as any
          )?.field;
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

          if (imgLocal === true) {
            const isClient = key === "client";
            const urlFieldName = isClient ? `${prefix}url_logo` : `${prefix}url_img`;
            const pathFieldName = isClient ? "logoPath" : "imagePath";

            const remoteAny = remote as Record<string, any>;
            const imageUrl = remoteAny[urlFieldName];
            if (imageUrl) {
              const folder = IMG_FOLDERS[key];
              if (folder) {
                const fileName = extractFileName(imageUrl);

                const downloadResult = await downloadAndSaveImage(
                  imageUrl,
                  folder,
                  fileName
                );

                if (downloadResult.code === 0) {
                  await localModel.update(
                    { [pathFieldName]: downloadResult.data },
                    { where: { [idField]: id } }
                  );
                }
              }
            }
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
