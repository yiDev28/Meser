import { LoginClient } from "../../../interfaces/app";
import { Client } from "../../models/Client/ClientModel";
import { supabase } from "./supabaseClient";
import { getLastSyncTime, saveLastSyncTime } from "./syncData";

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
    // Paso 1: Obtener la última marca de tiempo de la base de datos local.
    const lastSyncTime = await getLastSyncTime(_table);

    //  Construir la consulta a Supabase.
    let query = supabase
      .from("res_client")
      .select("cli_id,cli_name,cli_url_logo, cli_create_dat, cli_last_upt")
      .eq("cli_id", clientId); // Filtra los registros por el ID del cliente.

    // Aplicar el filtro de marca de tiempo para la sincronización incremental.
    if (lastSyncTime) {
      query = query.gte("cli_last_upt", lastSyncTime);
    }

    // Ejecutar la consulta.
    const { data, error } = await query;

    // Si hay un error, lo devolvemos inmediatamente.
    if (error) {
      await saveLastSyncTime(_table, "ERROR");
      return false;
    }

    // Procesa los datos para el "upsert" local.
    if (data && data.length > 0) {
      for (const remote of data) {
        // Busca un registro localmente por su ID.
        const localItem = await Client.findByPk(remote.cli_id);

        if (localItem) {
          // Si el item existe, lo actualiza.
          await localItem.update({
            name: remote.cli_name,
            updatedAt: remote.cli_last_upt,
          });
        } else {
          return false;
        }
      }
    }

    // Guardar la nueva marca de tiempo después de una sincronización exitosa.
    await saveLastSyncTime(_table, "SUCCESS");
    return true;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    await saveLastSyncTime(_table, "ERROR",errorMessage);
    return false;
  }
};
