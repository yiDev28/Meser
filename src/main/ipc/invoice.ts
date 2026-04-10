import { InvoiceDTO, InvoiceListDTO, InvoiceDetailDTO } from "@/interfaces/invoice";
import { getInvoices, getInvoicesOfDay, getInvoiceDetail, printInvoice } from "../services/application/invoiceService";
import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";

ipcMain.handle("get-invoices", async (): Promise<RESPONSE<InvoiceDTO[]>> => {
  try {
    return await getInvoices();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});

ipcMain.handle(
  "get-invoices-of-day",
  async (): Promise<RESPONSE<InvoiceListDTO[]>> => {
    try {
      return await getInvoicesOfDay();
    } catch (error) {
      return NEW_RESPONSE(-1, "Error al consultar facturas del día: " + error);
    }
  }
);

ipcMain.handle(
  "get-invoice-detail",
  async (_event, invoiceId: string): Promise<RESPONSE<InvoiceDetailDTO | null>> => {
    try {
      return await getInvoiceDetail(invoiceId);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error al consultar detalle de factura: " + error);
    }
  }
);

ipcMain.handle(
  "print-invoice",
  async (_event, invoiceId: string): Promise<RESPONSE<null>> => {
    try {
      return await printInvoice(invoiceId);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error al imprimir factura: " + error);
    }
  }
);