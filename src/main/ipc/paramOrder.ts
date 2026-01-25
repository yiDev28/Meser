import { MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { ipcMain } from "electron";
import {
  getCategoriesProducts,
  getMenu,
  getTables,
  getTypeOrder,
} from "../services/application/paramOrderService";
import { TableDTO } from "@/interfaces/table";
import { ProductCategoryDTO } from "@/interfaces/product";

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

ipcMain.handle("get-tables", async (): Promise<RESPONSE<TableDTO[]>> => {
  try {
    // Implementar la lógica para obtener las mesas
    return getTables();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});

ipcMain.handle("get-categories-products", async (): Promise<RESPONSE<ProductCategoryDTO[]>> => {
  try {
    // Implementar la lógica para obtener las mesas
    return getCategoriesProducts();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});