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
import Invoice from "../models/Invoice/InvoiceModel";
import InvoiceItem from "../models/Invoice/InvoiceItemModel";
import { CashRegister } from "../models/Cash/CashRegisterModel";
import { CashMovement } from "../models/Cash/CashMovementModel";
import { CashTypeMovement } from "../models/Cash/CashTypeMoveModel";
import SyncTime from "../models/Shared/SyncTimeModel";
import { SyncQueue } from "../models/Shared/syncQueueModel";

export async function _initDb() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conectado a SQLite");

    //await sequelize.sync();
    //console.log("Base de datos sincronizada");
    await applyAssociations();

    await SyncTime.sync({ alter: false, force: false });
    console.log("Modelo SyncTime sincronizado");

    await SyncQueue.sync({ alter: false, force: false });
    console.log("Modelo SyncQueue sincronizado");

    await Client.sync({ alter: false, force: false });
    console.log("Modelo Client sincronizado");

    await User.sync({ alter: false, force: false });
    console.log("Modelo User sincronizado");

    await OrderDetail.sync({ alter: false, force: false });
    console.log("Modelo OrderDetail sincronizado");

    await OrderType.sync({ alter: false, force: false });
    console.log("Modelo OrderType sincronizado");

    await OrderStatus.sync({ alter: false, force: false });
    console.log("Modelo OrderStatus sincronizado");

    await Order.sync({ alter: false, force: false });
    console.log("Modelo Order sincronizado");

    await ItemOrdStatus.sync({ alter: false, force: false });
    console.log("Modelo ItemOrdStatus sincronizado");

    await Location.sync({ alter: false, force: false });
    console.log("Modelo Location sincronizado");

    await Table.sync({ alter: false, force: false });
    console.log("Modelo Table sincronizado");

    await Product.sync({ alter: false, force: false });
    console.log("Modelo Product sincronizado");

    await ProductCategory.sync({ alter: false, force: false });
    console.log("Modelo ProductCategory sincronizado");

    await Menu.sync({ alter: false, force: false });
    console.log("Modelo Menu sincronizado");

    await MenuItem.sync({ alter: false, force: false });
    console.log("Modelo MenuItem sincronizado");

    await Customer.sync({ alter: false, force: false });
    console.log("Modelo Customer sincronizado");

    await GuestCustomer.sync({ alter: false, force: false });
    console.log("Modelo GuestCustomer sincronizado");

    await Invoice.sync({ alter: false, force: false });
    console.log("Modelo Invoice sincronizado");

    await InvoiceItem.sync({ alter: false, force: false });
    console.log("Modelo InvoiceItem sincronizado");

    await CashRegister.sync({ alter: false, force: false });
    console.log("Modelo CashRegister sincronizado");

    await CashMovement.sync({ alter: false, force: false });
    console.log("Modelo CashMovement sincronizado");

    await CashTypeMovement.sync({ alter: false, force: false });
    console.log("Modelo CashTypeMovement sincronizado");

    console.log("✅✅✅✅✅ Tablas sincronizadas con exito ✅✅✅✅✅");
  } catch (error) {
    console.error("❌ Error en la base de datos:", error);
  }
}
