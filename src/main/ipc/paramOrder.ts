import { ConfigInvoicedDTO, MenuDTO, OrderTypeDTO, TypePaymentObjDTO } from "@/interfaces/order";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { ipcMain } from "electron";
import {
  getCategoriesProducts,
  getConfigInvoiced,
  getMenu,
  getTables,
  getTypeOrder,
  getTypesPayments,
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

ipcMain.handle("get-menu", async (): Promise<RESPONSE<MenuDTO | null>> => {
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

ipcMain.handle("get-types_payments", async (): Promise<RESPONSE<TypePaymentObjDTO>> => {
  try {
    // Implementar la lógica para obtener las mesas
    return getTypesPayments();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});

ipcMain.handle("get-config_invoiced", async (): Promise<RESPONSE<ConfigInvoicedDTO>> => {
  try {
    // Implementar la lógica para obtener las mesas
    return getConfigInvoiced();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});