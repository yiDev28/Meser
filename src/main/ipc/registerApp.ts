import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "../../interfaces/response";
import { Client } from "../models/Client/ClientModel";
import { ClientData, LoginClient } from "../../interfaces/app";
import { validateClient } from "../services/supabase/clientService";
import { checkInternetConnection } from "../utils/network";
import { syncDataCloud } from "../services/supabase/syncData";
import { createUrlFile, downloadAndSaveFile } from "../services/shared/files";

ipcMain.handle("verify-register", async (): Promise<RESPONSE<ClientData>> => {
  try {
    const hasInternet = await checkInternetConnection();
    //validacion de registro en tabla
    const clientLocal = await Client.findOne();
    if (!clientLocal) {
      return NEW_RESPONSE(1, "No hay clientes registrados");
    }

    if (hasInternet) {
      const cliToOnline = await validateClient({
        idClient: clientLocal.dataValues.id,
        keyClient: clientLocal.dataValues.token,
      });
      if (!cliToOnline) {
        return NEW_RESPONSE(1, "Cliente no encontrado en linea");
      }

      await syncDataCloud(clientLocal.dataValues.id);
    }

    return NEW_RESPONSE(0, `cliente registrado:`, {
      idClient: clientLocal.dataValues.id,
      nameClient: clientLocal.dataValues.name,
      logoPath: clientLocal.dataValues.logoPath,
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

      //traer logo y guardarlo localmente si es necesario

      const logoUrl = await downloadAndSaveFile(
        cliToOnline.cli_url_logo,
        "images-app",
        `${data.idClient}_logo.png`
      );

      if (logoUrl.code !== 0) {
        return NEW_RESPONSE(
          1,
          "Error al descargar el logo del cliente: " + logoUrl.msg
        );
      }

      const logoLocalUrl = await createUrlFile(
        `images-app/${data.idClient}_logo.png`
      );

      if (logoLocalUrl.code !== 0) {
        return NEW_RESPONSE(
          1,
          "Error al crear la URL local del logo del cliente: " +
            logoLocalUrl.msg
        );
      }

      const mappedConfig = {
        id: data.idClient,
        name: cliToOnline.cli_name,
        token: data.keyClient,
        logoPath: logoLocalUrl.data ||"",
      };

      // Verificar si el cliente ya existe
      await Client.findByPk(data.idClient).then(async (existingClient: any) => {
        if (existingClient) {
          // Actualizar cliente existente
          await existingClient.update(mappedConfig);
        } else {
          //crear cliente
          await Client.create(mappedConfig);
        }
      });

      // Crear nuevo cliente si no existe
      return NEW_RESPONSE(0, "Cliente registrado correctamente", {
        idClient: data.idClient,
        nameClient: cliToOnline.cli_business_name,
        logoPath: mappedConfig.logoPath,
      });
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al registrar cliente" + error);
    }
  }
);
