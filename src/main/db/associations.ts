// src/db/associations.ts
import CleanupLog from "../models/Shared/CleanupLogModel";
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
import OrderMetadata from "../models/Order/OrderMetadataModel";
import { Parameter, ParameterValue } from "../models/Params/ParameterModel";
import Invoices from "../models/Invoice/InvoiceModel";
import InvoicesItems from "../models/Invoice/InvoiceItemModel";
import TypePayment from "../models/Invoice/TypePaymentModel";
import { CashRegister } from "../models/Cash/CashRegisterModel";
import { CashMovement } from "../models/Cash/CashMovementModel";
import { CashTypeMovement } from "../models/Cash/CashTypeMoveModel";

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

// Relación Order -> OrderMetadata
Order.hasMany(OrderMetadata, { foreignKey: "orderId", as: "metadataOrder" });

Invoices.hasMany(InvoicesItems, { foreignKey: "invoiceId", as: "itemsInvoice" });
InvoicesItems.belongsTo(Invoices, { foreignKey: "invoiceId", as: "invoice" });



Invoices.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customerInvoice",
});

OrderType.hasMany(ParameterValue, {
  foreignKey: "scopeRefId",
  as: "parameters",
});

ParameterValue.belongsTo(Parameter, {
  foreignKey: "parameterId",
  as: "definition",
});

CashRegister.hasMany(CashMovement, { foreignKey: "cashRegisterId", as: "movements" });
CashMovement.belongsTo(CashRegister, { foreignKey: "cashRegisterId", as: "cashRegister" });

CashMovement.belongsTo(CashTypeMovement, { foreignKey: "typeMovement", as: "typeMovementData" });
CashTypeMovement.hasMany(CashMovement, { foreignKey: "typeMovement", as: "movements" });

CashRegister.belongsTo(User, { foreignKey: "userId", as: "user" });
CashMovement.belongsTo(User, { foreignKey: "userId", as: "user" });

Invoices.belongsTo(CashRegister, { foreignKey: "cashRegisterId", as: "cashRegister" });
CashRegister.hasMany(Invoices, { foreignKey: "cashRegisterId", as: "invoices" });

Invoices.belongsTo(Order, { foreignKey: "orderId", as: "order" });
Invoices.belongsTo(User, { foreignKey: "userId", as: "userInvoice" });
Invoices.belongsTo(TypePayment, { foreignKey: "paymentMethod", as: "typePayment" });

InvoicesItems.belongsTo(Product, { foreignKey: "productId", as: "productInvoice" });

export async function applyAssociations() {
  console.log(" Relaciones aplicadas");
}
