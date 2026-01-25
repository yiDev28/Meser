import { TableDTO } from "@/interfaces/table";
import { ClientData, LoginClient, LoginUser } from "../../../interfaces/app";
import {
  CreateOrderDTO,
  MenuDTO,
  OrderDTO,
  OrderTypeDTO,
} from "../../../interfaces/order";
import { RESPONSE } from "../../../interfaces/response";
import { UserInterface } from "../../../interfaces/user";
import Invoice from "../../models/Invoice/InvoiceModel";
import { ProductCategoryDTO } from "@/interfaces/product";

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
    userId: number
  ) => Promise<RESPONSE<OrderDTO>>;

  cancelItemStatus: (
    orderId: string,
    orderItemId: string,
    userId: number
  ) => Promise<RESPONSE<OrderDTO>>;

  updateItemQuantity: (
    orderId: string,
    orderItemId: string,
    quantity: number,
    userId: number
  ) => Promise<RESPONSE<OrderDTO>>;

  cancelOrder: (orderId: string, userId: number) => Promise<RESPONSE<OrderDTO>>;

  createOrder: (order: CreateOrderDTO) => Promise<RESPONSE<OrderDTO>>;

  invoiceOrder: (
    orderId: string,
    customerId: number,
    tip: number,
    paymentMethod: string,
    invoiceElectronic: boolean,
    userId: number
  ) => Promise<RESPONSE<OrderDTO>>;

  //PARAM ORDER
  getTypeOrder: () => Promise<RESPONSE<OrderTypeDTO[]>>;
  getMenu: () => Promise<RESPONSE<MenuDTO>>;
  getTables: () => Promise<RESPONSE<TableDTO[]>>;
  getCategoriesProducts:() => Promise<RESPONSE<ProductCategoryDTO[]>>;

  //FACTURAS
  getInvoices: () => Promise<RESPONSE<Invoice[]>>;
}
