import { contextBridge, ipcRenderer } from "electron";
import { ElectronAPI } from "./windows/main/electron";
import { LoginClient, LoginUser } from "../interfaces/app";
import { CreateOrderDTO } from "@/interfaces/order";

// Detectamos qué tipo de ventana lo está usando
const windowType =
  process.argv.find((arg) => arg.startsWith("--window="))?.split("=")[1] ??
  "main";

// --- MAIN WINDOW  ---
if (windowType === "main") {
  const electronAPI: ElectronAPI = {

    exitApp: async () => await ipcRenderer.invoke("exit-app"),
    
    // REGISTRO APP
    verifyRegisterApp: async () => await ipcRenderer.invoke("verify-register"),
    registerApp: async (data: LoginClient) =>
      await ipcRenderer.invoke("register-app", data),

    // LOGIN USUARIO
    loginUser: async (data: LoginUser) =>
      await ipcRenderer.invoke("login-user", data),
    me: async (token: string) => await ipcRenderer.invoke("me", token),

    // ORDENES
    getOrdersPanel: async () => await ipcRenderer.invoke("get-orders-panel"),
    getOrdersSales: async () => await ipcRenderer.invoke("get-orders-sales"),

    updateItemStatus: async (orderId, orderItemId, userId) =>
      await ipcRenderer.invoke(
        "update-status-item-order",
        orderId,
        orderItemId,
        userId
      ),

    cancelItemStatus: async (orderId, orderItemId, userId) =>
      await ipcRenderer.invoke(
        "cancel-item-order",
        orderId,
        orderItemId,
        userId
      ),

    updateItemQuantity: async (orderId, orderItemId, quantity, userId) =>
      await ipcRenderer.invoke(
        "update-quantity-item-order",
        orderId,
        orderItemId,
        quantity,
        userId
      ),

    cancelOrder: async (orderId, userId) =>
      await ipcRenderer.invoke("cancel-order", orderId, userId),

    createOrder: async (order: CreateOrderDTO) =>
      await ipcRenderer.invoke("create-order", order),

    invoiceOrder: async (
      orderId,
      customerId,
      tip,
      paymentMethod,
      invoiceElectronic,
      userId
    ) =>
      await ipcRenderer.invoke(
        "invoice-order",
        orderId,
        customerId,
        tip,
        paymentMethod,
        invoiceElectronic,
        userId
      ),

    getTypeOrder: async () => await ipcRenderer.invoke("get-type-order"),
    getMenu: async () => await ipcRenderer.invoke("get-menu"),
    getTables: async () => await ipcRenderer.invoke("get-tables"),
    getInvoices: async () => await ipcRenderer.invoke("get-invoices"),
    getCategoriesProducts: async () => await ipcRenderer.invoke("get-categories-products"),
  };

  contextBridge.exposeInMainWorld("electron", electronAPI);
}

// --- SPLASH WINDOW (simple listener de mensajes) ---
if (windowType === "splash") {
  console.log("SI LLEGO AL PRELOAD DEL SPLASH");
  contextBridge.exposeInMainWorld("splashAPI", {

    exitApp: async () => await ipcRenderer.invoke("exit-app"),

    onUpdate: (callback: (msg: string) => void) => {
      ipcRenderer.on("splash-update", (_, msg) => callback(msg));
    },
  });
}



console.log(`[preload] loaded for ${windowType}`);
