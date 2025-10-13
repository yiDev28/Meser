import { CashTypeMovement } from "../models/Cash/CashTypeMoveModel";
import { Client } from "../models/Client/ClientModel";
import { Customer } from "../models/Customer/CustomerModel";
import Location from "../models/Establishment/LocationModel";
import Table from "../models/Establishment/TableModel";
import InvoiceItem from "../models/Invoice/InvoiceItemModel";
import Invoice from "../models/Invoice/InvoiceModel";
import MenuItem from "../models/Menu/MenuItemModel";
import Menu from "../models/Menu/MenuModel";
import OrderDetail from "../models/Order/OrderDetailsModel";
import Order from "../models/Order/OrderModel";
import { ItemOrdStatus, OrderStatus } from "../models/Order/OrderStatusModel";
import OrderType from "../models/Order/OrderTypeModel";
import ProductCategory from "../models/Products/ProductCatModel";
import Product from "../models/Products/ProductModel";
import User from "../models/User/UserModel";

export const syncModelsTables = {
    client: {
    localModel: Client,
    localTable: "client",
    cloudTable: "res_client",
    download: false,
  },
  users: {
    localModel: User,
    localTable: "users",
    cloudTable: "res_users",
    download: true,
  },
  product_categories: {
    localModel: ProductCategory,
    localTable: "product_categories",
    cloudTable: "res_product_categories",
    download: true,
  },
  products: {
    localModel: Product,
    localTable: "products",
    cloudTable: "res_products",
    download: true,
  },
  locations: {
    localModel: Location,
    localTable: "locations",
    cloudTable: "res_locations",
    download: true,
  },
  tables: {
    localModel: Table,
    localTable: "tables",
    cloudTable: "res_tables",
    download: true,
  },
  menus: {
    localModel: Menu,
    localTable: "menus",
    cloudTable: "res_menus",
    download: true,
  },
  menu_items: {
    localModel: MenuItem,
    localTable: "menu_items",
    cloudTable: "res_menu_items",
    download: true,
  },
  order_types: {
    localModel: OrderType,
    localTable: "order_types",
    cloudTable: "res_order_types",
    download: true,
  },
  order_statuses: {
    localModel: OrderStatus,
    localTable: "order_statuses",
    cloudTable: "res_order_statuses",
    download: true,
  },
  item_ord_statuses: {
    localModel: ItemOrdStatus,
    localTable: "item_ord_statuses",
    cloudTable: "res_item_ord_statuses",
    download: true,
  },
  customer: {
    localModel: Customer,
    localTable: "customer",
    cloudTable: "res_customer",
    download: true,
  },
  cash_type_movement: {
    localModel: CashTypeMovement,
    localTable: "cash_type_movement",
    cloudTable: "res_cash_type_movement",
    download: true,
  },
  orders: {
    localModel: Order,
    localTable: "orders",
    cloudTable: "res_orders",
    download: false,
  },
  order_details: {
    localModel: OrderDetail,
    localTable: "order_details",
    cloudTable: "res_order_details",
    download: false,
  },
  invoices: {
    localModel: Invoice,
    localTable: "invoices",
    cloudTable: "res_invoices",
    download: false,
  },
  invoice_items: {
    localModel: InvoiceItem,
    localTable: "invoice_items",
    cloudTable: "res_invoice_items",
    download: false,
  },
  
};