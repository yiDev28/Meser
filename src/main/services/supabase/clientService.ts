import { LoginClient } from "../../../interfaces/app";
import { Client } from "../../models/Client/ClientModel";
import { supabase } from "./supabaseClient";
import { getLastSyncTime, saveLastSyncTime } from "./syncPullService";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";

export async function validateClient(client: LoginClient) {
  const { data, error } = await supabase
    .from("res_client")
    .select("*")
    .eq("cli_id", client.idClient)
    .eq("cli_token", client.keyClient)
    .single();

  if (error || !data) {
    console.error("Error al validar cliente:", error);
    return null;
  }

  return data;
}

export const syncClientData = async (
  clientId: string
) => {
  const _table = "client";
  try {
    const lastSyncTime = await getLastSyncTime(_table);

    let query = supabase
      .from("res_client")
      .select("cli_id,cli_name,cli_image_url, cli_create_dat, cli_last_upt")
      .eq("cli_id", clientId);

    if (lastSyncTime) {
      query = query.gte("cli_last_upt", lastSyncTime);
    }

    const { data, error } = await query;

    if (error) {
      await saveLastSyncTime(_table, SYNC_STATUS.ERROR);
      return false;
    }

    if (data && data.length > 0) {
      for (const remote of data) {
        const localItem = await Client.findByPk(remote.cli_id);

        if (localItem) {
          const updateData: Record<string, unknown> = {
            name: remote.cli_name,
            updatedAt: remote.cli_last_upt,
          };

          if (remote.cli_image_url) {
            updateData.urlImage = remote.cli_image_url;
          }

          await localItem.update(updateData);
        } else {
          return false;
        }
      }
    }

    await saveLastSyncTime(_table, SYNC_STATUS.SUCCESS);
    return true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    await saveLastSyncTime(_table, SYNC_STATUS.ERROR, errorMessage);
    return false;
  }
};
