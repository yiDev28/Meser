import { contextBridge, ipcRenderer } from "electron";

interface InvoicePrintData {
  id: string;
  number: string;
  total: number;
  subtotal: number;
  tax: number;
  paymentMethodName: string;
  orderTypeName: string;
  createdAt: string;
  items: Array<{
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discount: number;
    total: number;
  }>;
  clientName?: string;
}

contextBridge.exposeInMainWorld("printAPI", {
  onInvoiceData: (callback: (data: InvoicePrintData) => void) => {
    ipcRenderer.on("invoice-print-data", (_, data: InvoicePrintData) => {
      callback(data);
    });
  },
});

console.log("[print preload] loaded");
