import { InvoiceDTO } from "@/interfaces/invoice";
import { getInvoices } from "../services/application/invoiceService";
import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";

ipcMain.handle("get-invoices", async (): Promise<RESPONSE<InvoiceDTO[]>> => {
  try {
    return await getInvoices();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});
