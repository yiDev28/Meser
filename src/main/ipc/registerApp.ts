import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "../../interfaces/response";
import { Client } from "../models/Client/ClientModel";
import { ClientData, LoginClient } from "../../interfaces/app";
import { validateClient } from "../services/supabase/clientService";
import { checkInternetConnection } from "../utils/network";
import { syncDataCloud } from "../services/supabase/syncData";

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
    });
  } catch (error) {
    return NEW_RESPONSE(-1, "Error al verificar el registro: " + error);
  }
});

ipcMain.handle("register-app", async (_event, data: LoginClient): Promise<RESPONSE<ClientData>> => {
    try {
      const cliToOnline = await validateClient(data);
      if (!cliToOnline) {
        return NEW_RESPONSE(
          1,
          "No se encuentra cliente registrado con esos datos."
        );
      }
      const mappedConfig = {
        id: data.idClient,
        name: cliToOnline.cli_name,
        token: data.keyClient,
      };

      // Crear nuevo cliente si no existe
      await Client.create(mappedConfig);

      return NEW_RESPONSE(0, "Cliente registrado correctamente", {
        idClient: data.idClient,
        nameClient: cliToOnline.cli_business_name,
      });
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al registrar cliente" + error);
    }
  }
);
