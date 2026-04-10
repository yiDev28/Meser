import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { CreateOrderDTO, OrderDTO } from "@/interfaces/order";
import {
  cancelItemOrder,
  cancelOrder,
  createOrder,
  getOrdersPanel,
  getOrdersSales,
  invoiceOrder,
  UpdateQuantityItemsOrder,
  updateStatusItemOrder,
} from "../services/application/orderService";
import { CreateInvoiceDTO } from "@/interfaces/invoice";

ipcMain.handle(
  "create-order",
  async (_event, order: CreateOrderDTO): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await createOrder(order);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al crear la orden: " + error);
    }
  },
);

ipcMain.handle("get-orders-panel", async (): Promise<RESPONSE<OrderDTO[]>> => {
  try {
    return await getOrdersPanel();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});

ipcMain.handle("get-orders-sales", async (): Promise<RESPONSE<OrderDTO[]>> => {
  try {
    return await getOrdersSales();
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
});

ipcMain.handle(
  "update-status-item-order",
  async (
    _event,
    orderId: string,
    itemOrderId: string,
    userId: number = 999,
  ): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await updateStatusItemOrder(orderId, itemOrderId, userId);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
    }
  },
);

ipcMain.handle(
  "cancel-item-order",
  async (
    _event,
    orderId: string,
    itemOrderId: string,
    userId: number = 999,
  ): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await cancelItemOrder(orderId, itemOrderId, userId);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
    }
  },
);

ipcMain.handle(
  "update-quantity-item-order",
  async (
    _event,
    orderId: string,
    orderItemId: string,
    quantity: number,
    userId: number = 999,
  ): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await UpdateQuantityItemsOrder(
        orderId,
        orderItemId,
        quantity,
        userId,
      );
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
    }
  },
);

ipcMain.handle(
  "cancel-order",
  async (
    _event,
    orderId: string,
    userId: number,
  ): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await cancelOrder(orderId, userId);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
    }
  },
);

ipcMain.handle(
  "invoice-order",
  async (_event, orderData: CreateInvoiceDTO): Promise<RESPONSE<OrderDTO>> => {
    try {
      return await invoiceOrder(orderData);
    } catch (error) {
      return NEW_RESPONSE(-1, "Error inesperado al facturar orden: " + error);
    }
  },
);
