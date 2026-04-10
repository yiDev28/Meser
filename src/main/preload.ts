import { contextBridge, ipcRenderer } from "electron";
import { ElectronAPI } from "./windows/main/electron";
import { LoginClient, LoginUser } from "../interfaces/app";
import { CreateOrderDTO } from "@/interfaces/order";
import {
  OpenCashRegisterDTO,
  CreateCashMovementDTO,
  CloseCashRegisterDTO,
} from "@/interfaces/cash";

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
        userId,
      ),

    cancelItemStatus: async (orderId, orderItemId, userId) =>
      await ipcRenderer.invoke(
        "cancel-item-order",
        orderId,
        orderItemId,
        userId,
      ),

    updateItemQuantity: async (orderId, orderItemId, quantity, userId) =>
      await ipcRenderer.invoke(
        "update-quantity-item-order",
        orderId,
        orderItemId,
        quantity,
        userId,
      ),

    cancelOrder: async (orderId, userId) =>
      await ipcRenderer.invoke("cancel-order", orderId, userId),

    createOrder: async (order: CreateOrderDTO) =>
      await ipcRenderer.invoke("create-order", order),

    invoiceOrder: async (orderData) =>
      await ipcRenderer.invoke("invoice-order", orderData),

    getTypeOrder: async () => await ipcRenderer.invoke("get-type-order"),
    getMenu: async () => await ipcRenderer.invoke("get-menu"),
    getTables: async () => await ipcRenderer.invoke("get-tables"),
    getInvoices: async () => await ipcRenderer.invoke("get-invoices"),
    getInvoicesOfDay: async () => await ipcRenderer.invoke("get-invoices-of-day"),
    getInvoiceDetail: async (invoiceId: string) =>
      await ipcRenderer.invoke("get-invoice-detail", invoiceId),
    printInvoice: async (invoiceId: string) =>
      await ipcRenderer.invoke("print-invoice", invoiceId),
    getCategoriesProducts: async () =>
      await ipcRenderer.invoke("get-categories-products"),
    getTypesPayments: async () =>
      await ipcRenderer.invoke("get-types_payments"),
    getConfigInvoiced: async () =>
      await ipcRenderer.invoke("get-config_invoiced"),

    // CAJA
    openCashRegister: async (data: OpenCashRegisterDTO) =>
      await ipcRenderer.invoke("open-cash-register", data),

    closeCashRegister: async (data: CloseCashRegisterDTO) =>
      await ipcRenderer.invoke("close-cash-register", data),

    getCurrentCashRegister: async (userId: number) =>
      await ipcRenderer.invoke("get-current-cash-register", userId),

    getCashMovements: async (cashRegisterId: string) =>
      await ipcRenderer.invoke("get-cash-movements", cashRegisterId),

    createCashMovement: async (data: CreateCashMovementDTO) =>
      await ipcRenderer.invoke("create-cash-movement", data),

    getTypeMovements: async () =>
      await ipcRenderer.invoke("get-type-movements"),

    getCashSummary: async (cashRegisterId: string) =>
      await ipcRenderer.invoke("get-cash-summary", cashRegisterId),

    // SYNC
    getSyncModels: async () => await ipcRenderer.invoke("get-sync-models"),
    getSyncStatus: async () => await ipcRenderer.invoke("get-sync-status"),
    getPendingSyncItems: async () => await ipcRenderer.invoke("get-pending-sync-items"),
    syncPullAll: async () => await ipcRenderer.invoke("sync-pull-all"),
    syncPullTable: async (tableName: string) => await ipcRenderer.invoke("sync-pull-table", tableName),
    syncPushPending: async () => await ipcRenderer.invoke("sync-push-pending"),
    syncPushTable: async (tableName: string) => await ipcRenderer.invoke("sync-push-table", tableName),
    retrySyncErrors: async () => await ipcRenderer.invoke("retry-sync-errors"),

    // WINDOW CONTROLS
    minimizeWindow: async () => await ipcRenderer.invoke("minimize-window"),
    maximizeWindow: async () => await ipcRenderer.invoke("maximize-window"),
    isMaximized: async () => await ipcRenderer.invoke("get-is-maximized"),
    getWindowConfig: async () => await ipcRenderer.invoke("get-window-config"),

    // CONFIG
    getAllConfig: async () => await ipcRenderer.invoke("get-all-config"),
    getConfigValue: async (key: string) => await ipcRenderer.invoke("get-config-value", key),
    setConfigValue: async (key: string, value: string) => await ipcRenderer.invoke("set-config-value", key, value),
    setConfigBatch: async (configs: Record<string, string>) => await ipcRenderer.invoke("set-config-batch", configs),
    getDisplays: async () => await ipcRenderer.invoke("get-displays"),
    setScreenIndex: async (index: number) => await ipcRenderer.invoke("set-screen-index", index),
    detectDisplay: async () => await ipcRenderer.invoke("detect-display"),
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
