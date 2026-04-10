import { TableDTO } from "@/interfaces/table";
import { ClientData, LoginClient, LoginUser } from "../../../interfaces/app";
import {
  ConfigInvoicedDTO,
  CreateOrderDTO,
  MenuDTO,
  OrderDTO,
  OrderTypeDTO,
  TypePaymentObjDTO,
} from "../../../interfaces/order";
import { RESPONSE } from "../../../interfaces/response";
import { UserInterface } from "../../../interfaces/user";
import { ProductCategoryDTO } from "@/interfaces/product";
import {
  CreateInvoiceDTO,
  InvoiceListDTO,
  InvoiceDetailDTO,
} from "@/interfaces/invoice";
import {
  CashRegisterDTO,
  CashMovementDTO,
  TypeMovementDTO,
  OpenCashRegisterDTO,
  CreateCashMovementDTO,
  CloseCashRegisterDTO,
  CashSummaryDTO,
} from "@/interfaces/cash";
import {
  SyncModelDTO,
  SyncStatusDTO,
  PendingSyncItemDTO,
} from "@/interfaces/sync";

export interface ElectronAPI {
  //APP

  exitApp: () => Promise<void>;

  // REGISTRO APP
  verifyRegisterApp: () => Promise<RESPONSE<ClientData>>;
  registerApp: (data: LoginClient) => Promise<RESPONSE<ClientData>>;

  // LOGIN
  loginUser: (data: LoginUser) => Promise<RESPONSE<UserInterface>>;
  me: (token: string) => Promise<unknown>;

  // VERIFICACIONES

  // DATOS BÁSICOS

  // ORDENES
  getOrdersPanel: () => Promise<RESPONSE<OrderDTO[]>>;
  getOrdersSales: () => Promise<RESPONSE<OrderDTO[]>>;

  updateItemStatus: (
    orderId: string,
    orderItemId: string,
    userId: number,
  ) => Promise<RESPONSE<OrderDTO>>;

  cancelItemStatus: (
    orderId: string,
    orderItemId: string,
    userId: number,
  ) => Promise<RESPONSE<OrderDTO>>;

  updateItemQuantity: (
    orderId: string,
    orderItemId: string,
    quantity: number,
    userId: number,
  ) => Promise<RESPONSE<OrderDTO>>;

  cancelOrder: (orderId: string, userId: number) => Promise<RESPONSE<OrderDTO>>;

  createOrder: (order: CreateOrderDTO) => Promise<RESPONSE<OrderDTO>>;

  invoiceOrder: (orderData: CreateInvoiceDTO) => Promise<RESPONSE<OrderDTO>>;

  //PARAM ORDER
  getTypeOrder: () => Promise<RESPONSE<OrderTypeDTO[]>>;
  getMenu: () => Promise<RESPONSE<MenuDTO>>;
  getTables: () => Promise<RESPONSE<TableDTO[]>>;
  getCategoriesProducts: () => Promise<RESPONSE<ProductCategoryDTO[]>>;

  //FACTURAS
  getInvoices: () => Promise<RESPONSE<unknown[]>>;
  getInvoicesOfDay: () => Promise<RESPONSE<InvoiceListDTO[]>>;
  getInvoiceDetail: (invoiceId: string) => Promise<RESPONSE<InvoiceDetailDTO | null>>;
  printInvoice: (invoiceId: string) => Promise<RESPONSE<null>>;
  getTypesPayments: () => Promise<RESPONSE<TypePaymentObjDTO>>;
  getConfigInvoiced: () => Promise<RESPONSE<ConfigInvoicedDTO>>;

  // CAJA
  openCashRegister: (data: OpenCashRegisterDTO) => Promise<RESPONSE<CashRegisterDTO>>;
  closeCashRegister: (data: CloseCashRegisterDTO) => Promise<RESPONSE<CashRegisterDTO>>;
  getCurrentCashRegister: (userId: number) => Promise<RESPONSE<CashRegisterDTO | null>>;
  getCashMovements: (cashRegisterId: string) => Promise<RESPONSE<CashMovementDTO[]>>;
  createCashMovement: (data: CreateCashMovementDTO) => Promise<RESPONSE<CashMovementDTO>>;
  getTypeMovements: () => Promise<RESPONSE<TypeMovementDTO[]>>;
  getCashSummary: (cashRegisterId: string) => Promise<RESPONSE<CashSummaryDTO>>;

  // SYNC
  getSyncModels: () => Promise<RESPONSE<SyncModelDTO[]>>;
  getSyncStatus: () => Promise<RESPONSE<SyncStatusDTO>>;
  getPendingSyncItems: () => Promise<RESPONSE<PendingSyncItemDTO[]>>;
  syncPullAll: () => Promise<RESPONSE>;
  syncPullTable: (tableName: string) => Promise<RESPONSE>;
  syncPushPending: () => Promise<RESPONSE>;
  syncPushTable: (tableName: string) => Promise<RESPONSE>;
  retrySyncErrors: () => Promise<RESPONSE>;

  // WINDOW CONTROLS
  minimizeWindow: () => Promise<void>;
  maximizeWindow: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  getWindowConfig: () => Promise<{
    hideTitleBar: boolean;
    fullscreen: boolean;
    openDevTools: boolean;
    showMinimize: boolean;
    showMaximize: boolean;
    showClose: boolean;
    titleBarTitle: string;
    titleBarBg: string;
    titleBarTextColor: string;
  }>;

  // CONFIG
  getAllConfig: () => Promise<Record<string, string>>;
  getAllConfigWithDescriptions: () => Promise<Record<string, { value: string; description: string }>>;
  getConfigValue: (key: string) => Promise<string | null>;
  setConfigValue: (key: string, value: string) => Promise<void>;
  setConfigBatch: (configs: Record<string, string>) => Promise<void>;
  getDisplays: () => Promise<Array<{
    id: number;
    label: string;
    bounds: { x: number; y: number; width: number; height: number };
    workArea: { x: number; y: number; width: number; height: number };
  }>>;
  setScreenIndex: (index: number) => Promise<void>;
  detectDisplay: () => Promise<number>;

  // APP
  restartApp: () => Promise<void>;
}
