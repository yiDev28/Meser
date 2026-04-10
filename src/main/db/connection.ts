import { Client } from "@/main/models/Client/ClientModel";
import ProductCategory from "@/main/models/Products/ProductCatModel";
import Product from "@/main/models/Products/ProductModel";
import Location from "@/main/models/Establishment/LocationModel";
import Table from "@/main/models/Establishment/TableModel";
import MenuItem from "@/main/models/Menu/MenuItemModel";
import Menu from "@/main/models/Menu/MenuModel";
import OrderDetail from "@/main/models/Order/OrderDetailsModel";
import Order from "@/main/models/Order/OrderModel";
import {
  ItemOrdStatus,
  OrderStatus,
} from "@/main/models/Order/OrderStatusModel";
import { Customer, GuestCustomer } from "@/main/models/Customer/CustomerModel";
import OrderType from "@/main/models/Order/OrderTypeModel";
import User from "@/main/models/User/UserModel";
import { applyAssociations } from "./associations";
import { sequelize } from "./db";
import Invoices from "../models/Invoice/InvoiceModel";
import InvoicesItems from "../models/Invoice/InvoiceItemModel";
import { CashRegister } from "../models/Cash/CashRegisterModel";
import { CashMovement } from "../models/Cash/CashMovementModel";
import { CashTypeMovement } from "../models/Cash/CashTypeMoveModel";
import SyncTime from "../models/Shared/SyncTimeModel";
import { SyncQueue } from "../models/Shared/syncQueueModel";
import OrderMetadata from "../models/Order/OrderMetadataModel";
import { Parameter, ParameterScope, ParameterValue } from "../models/Params/ParameterModel";
import TypePayment from "../models/Invoice/TypePaymentModel";
import InvoicesSurcharges from "../models/Invoice/InvoiceSurchargeModel";
import AppConfig from "../models/AppConfig/AppConfigModel";

export const _models = [
  Client,
  ProductCategory,
  Product,
  Location,
  Table,
  MenuItem,
  Menu,
  OrderDetail,
  Order,
  ItemOrdStatus,
  OrderStatus,
  Customer,
  GuestCustomer,
  OrderType,
  User,
  Invoices,
  InvoicesItems,
  CashRegister,
  CashMovement,
  CashTypeMovement,
  SyncTime,
  SyncQueue,
  OrderMetadata,
  Parameter,
  ParameterScope,
  ParameterValue,
  TypePayment,
  InvoicesSurcharges,
  AppConfig,
];

export async function _initDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a SQLite");

    await applyAssociations();
    await sequelize.sync({ alter: false, force: false });
    console.log("✅ Tablas sincronizadas con éxito");
  } catch (error) {
    console.error("❌ Error en la base de datos:", error);
  }
}
