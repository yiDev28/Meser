// src/db/associations.ts
import Order from "../models/Order/OrderModel";
import OrderDetail from "../models/Order/OrderDetailsModel";
import { OrderStatus, ItemOrdStatus } from "../models/Order/OrderStatusModel";
import OrderType from "../models/Order/OrderTypeModel";
import Table from "../models/Establishment/TableModel";
import User from "../models/User/UserModel";
import Product from "../models/Products/ProductModel";
import { Customer, GuestCustomer } from "../models/Customer/CustomerModel";
import MenuItem from "../models/Menu/MenuItemModel";
import Menu from "../models/Menu/MenuModel";
import ProductCategory from "../models/Products/ProductCatModel";
import Invoice from "../models/Invoice/InvoiceModel";
import InvoiceItem from "../models/Invoice/InvoiceItemModel";

// Relación Order -> OrderDetails
Order.hasMany(OrderDetail, { foreignKey: "orderId", as: "items" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId", as: "order" });

// Relación Order -> Status
Order.belongsTo(OrderStatus, { foreignKey: "status", as: "orderStatus" });

// Relación OrderDetail -> ItemOrdStatus
OrderDetail.belongsTo(ItemOrdStatus, {
  foreignKey: "status",
  as: "itemStatus",
});

// Relación Order -> Tipo de Orden
Order.belongsTo(OrderType, { foreignKey: "orderType", as: "type" });

// Relación Order -> Mesa
Order.belongsTo(Table, { foreignKey: "tableNumber", as: "table" });

// Relación Order -> Usuario (quien creó)
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

// Relación OrderDetail -> MenuItem
OrderDetail.belongsTo(MenuItem, { foreignKey: "menuItemId", as: "menuItem" });

// Relación OrderDetail -> Menu
Menu.hasMany(MenuItem, { foreignKey: "menuId", as: "menuItems" });
MenuItem.belongsTo(Menu, { foreignKey: "menuId", as: "menu" });

// Relación OrderDetail -> Product
MenuItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

// Relación OrderDetail -> ProductCategory
Product.belongsTo(ProductCategory, {
  foreignKey: "category",
  as: "productCategory",
});

// Relación Order -> GuestCustomer
Order.belongsTo(GuestCustomer, {
  foreignKey: "guestCustId",
  as: "guestCustomer",
});

// en Invoice.js
Invoice.hasMany(InvoiceItem, { foreignKey: "invoiceId", as: "itemsInvoice" });
// en InvoiceItem.js
InvoiceItem.belongsTo(Invoice, { foreignKey: "invoiceId", as: "invoice" });

Invoice.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customerInvoice",
});

export async function applyAssociations() {
  console.log(" Relaciones aplicadas");
}
