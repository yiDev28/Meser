import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "../../interfaces/response";
import { Client } from "../models/Client/ClientModel";
import { ClientData, LoginClient } from "../../interfaces/app";
import { validateClient } from "../services/supabase/clientService";
import { checkInternetConnection } from "../utils/network";
import { syncDataCloud } from "../services/supabase/syncPullService";
import { executeSyncFromCloud } from "../services/supabase/syncPullExecutor";
import { downloadAndSaveImageUrl, FOLDER_NAMES } from "../services/shared/files";

async function downloadClientLogo(clientId: string, remoteUrl: string | null | undefined): Promise<string | null> {
  if (!remoteUrl) return null;

  try {
    const result = await downloadAndSaveImageUrl(
      remoteUrl,
      FOLDER_NAMES.CLIENT_LOGOS,
      `${clientId}_logo.png`
    );

    return result.code === 0 && result.data ? result.data : null;
  } catch (error) {
    console.error("Error downloading client logo:", error);
    return null;
  }
}

ipcMain.handle("verify-register", async (): Promise<RESPONSE<ClientData>> => {
  try {
    const hasInternet = await checkInternetConnection();
    const clientLocal = await Client.findOne();
    if (!clientLocal) {
      return NEW_RESPONSE(1, "No hay clientes registrados");
    }

    let imagePath = clientLocal.dataValues.imagePath;

    if (hasInternet) {
      const cliToOnline = await validateClient({
        idClient: clientLocal.dataValues.id,
        keyClient: clientLocal.dataValues.token,
      });
      if (!cliToOnline) {
        return NEW_RESPONSE(1, "Cliente no encontrado en linea");
      }

      const remoteLogoUrl = (cliToOnline as Record<string, unknown>).cli_image_url as string | null;
      if (remoteLogoUrl) {
        const newImagePath = await downloadClientLogo(clientLocal.dataValues.id, remoteLogoUrl);
        if (newImagePath) {
          imagePath = newImagePath;
          await clientLocal.update({ imagePath });
        }
      }

      await syncDataCloud(clientLocal.dataValues.id);
    }

    return NEW_RESPONSE(0, `cliente registrado:`, {
      idClient: clientLocal.dataValues.id,
      nameClient: clientLocal.dataValues.name,
      imagePath,
    });
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al verificar el registro: " + error);
  }
});

ipcMain.handle(
  "register-app",
  async (_event, data: LoginClient): Promise<RESPONSE<ClientData>> => {
    try {
      const cliToOnline = await validateClient(data);
      if (!cliToOnline) {
        return NEW_RESPONSE(
          1,
          "No se encuentra cliente registrado con esos datos."
        );
      }

      const remoteLogoUrl = (cliToOnline as Record<string, unknown>).cli_image_url as string | null;
      let imagePath = "";

      if (remoteLogoUrl) {
        const result = await downloadAndSaveImageUrl(
          remoteLogoUrl,
          FOLDER_NAMES.CLIENT_LOGOS,
          `${data.idClient}_logo.png`
        );

        if (result.code !== 0) {
          return NEW_RESPONSE(
            1,
            "Error al descargar el logo del cliente: " + result.msg
          );
        }

        imagePath = result.data || "";
      }

      const mappedConfig = {
        id: data.idClient,
        name: cliToOnline.cli_name,
        idNumber: cliToOnline.cli_id_number,
        token: data.keyClient,
        urlImage: cliToOnline.cli_image_url,
        imagePath,
      };

      await Client.findByPk(data.idClient).then(async (existingClient: unknown) => {
        const client = existingClient as InstanceType<typeof Client> | null;
        if (client) {
          await client.update(mappedConfig);
        } else {
          await Client.create(mappedConfig);
        }
      });

      const hasInternet = await checkInternetConnection();
      if (hasInternet) {
        await executeSyncFromCloud(data.idClient);
      }

      return NEW_RESPONSE(0, "Cliente registrado correctamente", {
        idClient: data.idClient,
        nameClient: cliToOnline.cli_business_name,
        imagePath: mappedConfig.imagePath,
      });
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al registrar cliente" + error);
    }
  }
);
