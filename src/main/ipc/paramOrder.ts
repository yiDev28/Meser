import { MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { ipcMain } from "electron";
import {
  getMenu,
  getTypeOrder,
} from "../services/application/paramOrderService";

ipcMain.handle(
  "get-type-order",
  async (): Promise<RESPONSE<OrderTypeDTO[]>> => {
    try {
      return await getTypeOrder();
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
    }
  }
);

ipcMain.handle("get-menu", async (): Promise<RESPONSE<MenuDTO>> => {
  try {
    return await getMenu();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});
