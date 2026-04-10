import { CashTypeMovement } from "../models/Cash/CashTypeMoveModel";
import { CashRegister } from "../models/Cash/CashRegisterModel";
import { CashMovement } from "../models/Cash/CashMovementModel";
import { Client } from "../models/Client/ClientModel";
import { Customer, GuestCustomer } from "../models/Customer/CustomerModel";
import Location from "../models/Establishment/LocationModel";
import Table from "../models/Establishment/TableModel";
import MenuItem from "../models/Menu/MenuItemModel";
import Menu from "../models/Menu/MenuModel";
import OrderDetail from "../models/Order/OrderDetailsModel";
import Order from "../models/Order/OrderModel";
import OrderMetadata from "../models/Order/OrderMetadataModel.ts";
import { ItemOrdStatus, OrderStatus } from "../models/Order/OrderStatusModel";
import OrderType from "../models/Order/OrderTypeModel";
import ProductCategory from "../models/Products/ProductCatModel";
import Product from "../models/Products/ProductModel";
import User from "../models/User/UserModel";
import {
  Parameter,
  ParameterScope,
  ParameterValue,
} from "../models/Params/ParameterModel.ts";
import TypePayment from "../models/Invoice/TypePaymentModel.ts";
import InvoicesSurcharges from "../models/Invoice/InvoiceSurchargeModel.ts";
import Invoices from "../models/Invoice/InvoiceModel";
import InvoicesItems from "../models/Invoice/InvoiceItemModel";

export interface SyncModelEntry {
  localModel: any;
  localTable: string;
  cloudTable: string;
  download: boolean;
  paramGlobal?: boolean;
  paramClient?: boolean;
  imgLocal?: boolean;
}

export const syncModelsTables: Record<string, SyncModelEntry> = {
  client: {
    localModel: Client,
    localTable: "client",
    cloudTable: "res_client",
    download: false,
    paramGlobal: false,
    paramClient: true,
    imgLocal: true,

  },
  users: {
    localModel: User,
    localTable: "users",
    cloudTable: "res_users",
    download: true,
    paramGlobal: false,
    paramClient: true,
  },
  product_categories: {
    localModel: ProductCategory,
    localTable: "product_categories",
    cloudTable: "res_product_categories",
    download: true,
    paramGlobal: false,
    paramClient: true,
    imgLocal: true,
  },
  products: {
    localModel: Product,
    localTable: "products",
    cloudTable: "res_products",
    download: true,
    paramGlobal: false,
    paramClient: true,
    imgLocal: true,
  },
  locations: {
    localModel: Location,
    localTable: "locations",
    cloudTable: "res_locations",
    download: true,
    paramGlobal: false,
    paramClient: true,
  },
  tables: {
    localModel: Table,
    localTable: "tables",
    cloudTable: "res_tables",
    download: true,
    paramGlobal: false,
    paramClient: true,
  },
  menus: {
    localModel: Menu,
    localTable: "menus",
    cloudTable: "res_menus",
    download: true,
    paramGlobal: false,
    paramClient: true,
  },
  menu_items: {
    localModel: MenuItem,
    localTable: "menu_items",
    cloudTable: "res_menu_items",
    download: true,
    paramGlobal: false,
    paramClient: true,
  },
  order_types: {
    localModel: OrderType,
    localTable: "order_types",
    cloudTable: "res_order_types",
    download: true,
    paramGlobal: true,
    paramClient: false,
  },
  order_statuses: {
    localModel: OrderStatus,
    localTable: "order_statuses",
    cloudTable: "res_order_statuses",
    download: true,
    paramGlobal: true,
    paramClient: false,
  },
  item_ord_statuses: {
    localModel: ItemOrdStatus,
    localTable: "item_ord_statuses",
    cloudTable: "res_item_ord_statuses",
    download: true,
    paramGlobal: true,
    paramClient: false,
  },
  customer: {
    localModel: Customer,
    localTable: "customer",
    cloudTable: "res_customer",
    download: true,
    paramGlobal: true,
    paramClient: true,
  },
  cash_type_movement: {
    localModel: CashTypeMovement,
    localTable: "cash_type_movement",
    cloudTable: "res_cash_type_movement",
    download: true,
    paramGlobal: true,
    paramClient: true,
  },
  orders: {
    localModel: Order,
    localTable: "orders",
    cloudTable: "res_orders",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  order_details: {
    localModel: OrderDetail,
    localTable: "order_details",
    cloudTable: "res_order_details",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  invoices: {
    localModel: Invoices,
    localTable: "invoices",
    cloudTable: "res_invoices",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  invoice_items: {
    localModel: InvoicesItems,
    localTable: "invoices_items",
    cloudTable: "res_invoices_items",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  invoices_surcharges: {
    localModel: InvoicesSurcharges,
    localTable: "invoices_surcharges",
    cloudTable: "res_invoices_surcharges",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  order_metadata: {
    localModel: OrderMetadata,
    localTable: "order_metadata",
    cloudTable: "res_order_metadata",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  parameter: {
    localModel: Parameter,
    localTable: "parameter",
    cloudTable: "res_parameter",
    download: true,
    paramGlobal: true,
    paramClient: false,
  },
  parameter_scope: {
    localModel: ParameterScope,
    localTable: "parameter_scope",
    cloudTable: "res_parameter_scope",
    download: true,
    paramGlobal: true,
    paramClient: false,
  },
  parameter_value: {
    localModel: ParameterValue,
    localTable: "parameter_value",
    cloudTable: "res_parameter_value",
    download: true,
    paramGlobal: true,
    paramClient: true,
  },
  type_payment: {
    localModel: TypePayment,
    localTable: "type_payment",
    cloudTable: "res_type_payment",
    download: true,
    paramGlobal: true,
    paramClient: true,
  },
  cash_registers: {
    localModel: CashRegister,
    localTable: "cash_registers",
    cloudTable: "res_cash_registers",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  cash_movements: {
    localModel: CashMovement,
    localTable: "cash_movements",
    cloudTable: "res_cash_movements",
    download: false,
    paramGlobal: false,
    paramClient: false,
  },
  guest_customer: {
    localModel: GuestCustomer,
    localTable: "guest_customer",
    cloudTable: "res_guest_customer",
    download: true,
    paramGlobal: true,
    paramClient: true,
  },

};
