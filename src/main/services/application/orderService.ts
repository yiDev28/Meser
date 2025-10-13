import { createRequire } from "node:module";
import OrderType from "@/main/models/Order/OrderTypeModel";
import { CreateOrderDTO, OrderDTO } from "@/interfaces/order";
import {
  ItemOrdStatus,
  OrderStatus,
} from "@/main/models/Order/OrderStatusModel";
import Table from "@/main/models/Establishment/TableModel";
import Product from "@/main/models/Products/ProductModel";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { getErrorMessage } from "@/utils/errorUtils";
import { sequelize } from "@/main/db/db";
import Order from "@/main/models/Order/OrderModel";
import OrderDetail from "@/main/models/Order/OrderDetailsModel";
import { GuestCustomer } from "@/main/models/Customer/CustomerModel";
import MenuItem from "@/main/models/Menu/MenuItemModel";
import Invoice from "@/main/models/Invoice/InvoiceModel";
import InvoiceItem from "@/main/models/Invoice/InvoiceItemModel";
import { upsertSyncQueue } from "./syncQueue";
const require = createRequire(import.meta.url);
const { Op } = require("sequelize");

export async function createOrder(
  orderData: CreateOrderDTO
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    const payloadOrder: Order = {};
    const typeOrder = await OrderType.findByPk(orderData.orderType);

    // Validar datos obligatorios para ordenes a domicilio
    if (typeOrder && typeOrder.paramType === "DELIVERY") {
      if (orderData.name === undefined || orderData.name.trim() === "") {
        return NEW_RESPONSE(
          1,
          "El nombre del cliente es obligatorio para ordenes a domicilio."
        );
      }
      if (orderData.address === undefined || orderData.address.trim() === "") {
        return NEW_RESPONSE(
          1,
          "La dirección es obligatoria para ordenes a domicilio."
        );
      }
      if (orderData.phone === undefined || orderData.phone.trim() === "") {
        return NEW_RESPONSE(
          1,
          "El teléfono es obligatorio para ordenes a domicilio."
        );
      }

      const payloadCustomer = {
        phone: orderData.phone,
        name: orderData.name,
        address: orderData.address,
        city: orderData.codCity || 0,
        userId: orderData.userId,
      };

      let customerGuest = await GuestCustomer.findOne({
        where: { phone: orderData.phone },
        transaction,
      });

      if (customerGuest) {
        await customerGuest.update(payloadCustomer, { transaction });
      } else {
        customerGuest = await GuestCustomer.create(payloadCustomer, {
          transaction,
        });
      }

      payloadOrder.guestCustId = customerGuest.id;
    }

    // Validar mesa si es orden en el local
    if (typeOrder && typeOrder.paramType === "ONSITE") {
      if (orderData.tableId === undefined || orderData.tableId <= 0) {
        return NEW_RESPONSE(
          1,
          "El número de mesa es obligatorio para ordenes en el local."
        );
      }

      payloadOrder.tableNumber = orderData.tableId;
    }

    Object.assign(payloadOrder, {
      customerId: 0,
      tip: 0,
      total: 0,
      notes: orderData.notes,
      orderType: orderData.orderType,
      status: 1,
      userId: orderData.userId,
    });

    const maxLocal = await Order.max("localNumber", { transaction });
    const order = await Order.create(
      { ...payloadOrder, localNumber: (maxLocal ?? 0) + 1 },
      { transaction }
    );

    await upsertSyncQueue(
      {
        recordId: order.id,
        tableName: "orders",
        action: "insert",
        userId: orderData.userId,
      },
      transaction
    );

    let seq = 1;

    for (const item of orderData.items) {
      const payloadItem = {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        notes: item.notes,
        status: 1,
        userId: orderData.userId,
      };

      const orderDetail = await OrderDetail.create(
        { ...payloadItem, orderId: order.id, sequence: seq++ },
        { transaction }
      );

      await upsertSyncQueue(
        {
          tableName: "order_details",
          recordId: orderDetail.id,
          action: "insert",
          userId: orderData.userId,
        },
        transaction
      );
    }

    await transaction.commit();

    const _order = await getOrder(order.id);

    return NEW_RESPONSE(0, "Orden registrada", _order.data);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(
      -1,
      "Error inesperado al registrar la orden: " + getErrorMessage(error)
    );
  }
}

export async function getOrdersPanel(): Promise<RESPONSE<OrderDTO[]>> {
  try {
    const _orders = await Order.findAll({
      attributes: {
        exclude: ["status", "orderType", "tableNumber", "tip"],
      },
      include: [
        {
          model: OrderType,
          as: "type",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: GuestCustomer,
          as: "guestCustomer",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderStatus,
          as: "orderStatus",
          attributes: {
            exclude: [
              "description",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          where: { paramPanel: true },
        },
        {
          model: Table,
          as: "table",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderDetail,
          as: "items",
          attributes: {
            exclude: [
              "menuItemId",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: {
                exclude: [
                  "price",
                  "productId",
                  "status",
                  "userId",
                  "createdAt",
                  "updatedAt",
                ],
              },
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: {
                    exclude: ["status", "userId", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
            {
              model: ItemOrdStatus,
              as: "itemStatus",
              attributes: {
                exclude: ["status", "userId", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      //where: { creat: 1 },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación descend
    });

    return NEW_RESPONSE(
      0,
      "",
      _orders.map((order: Order) => order.get({ plain: true })) as OrderDTO[]
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
}

export async function getOrdersSales(): Promise<RESPONSE<OrderDTO[]>> {
  try {
    const _orders = await Order.findAll({
      attributes: {
        exclude: ["status", "orderType", "tableNumber", "tip"],
      },
      include: [
        {
          model: OrderType,
          as: "type",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: GuestCustomer,
          as: "guestCustomer",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderStatus,
          as: "orderStatus",
          attributes: {
            exclude: [
              "description",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          where: { completed: false },
        },
        {
          model: Table,
          as: "table",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderDetail,
          as: "items",
          attributes: {
            exclude: [
              "menuItemId",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: {
                exclude: [
                  "productId",
                  "status",
                  "userId",
                  "createdAt",
                  "updatedAt",
                ],
              },
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: {
                    exclude: ["status", "userId", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
            {
              model: ItemOrdStatus,
              as: "itemStatus",
              attributes: {
                exclude: ["status", "userId", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      //where: { creat: 1 },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación descend
    });

    return NEW_RESPONSE(
      0,
      "",
      _orders.map((order: Order) => order.get({ plain: true })) as OrderDTO[]
    );
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
}

export async function getOrder(orderId: string): Promise<RESPONSE<OrderDTO>> {
  try {
    const order = await Order.findOne({
      attributes: {
        exclude: ["status", "orderType", "tableNumber", "guestCustId"],
      },
      include: [
        {
          model: OrderType,
          as: "type",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: GuestCustomer,
          as: "guestCustomer",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderStatus,
          as: "orderStatus",
          attributes: {
            exclude: [
              "description",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
        },
        {
          model: Table,
          as: "table",
          attributes: {
            exclude: ["status", "userId", "createdAt", "updatedAt"],
          },
        },
        {
          model: OrderDetail,
          as: "items",
          attributes: {
            exclude: [
              "menuItemId",
              "status",
              "userId",
              "createdAt",
              "updatedAt",
            ],
          },
          include: [
            {
              model: MenuItem,
              as: "menuItem",
              attributes: {
                exclude: [
                  "productId",
                  "status",
                  "userId",
                  "createdAt",
                  "updatedAt",
                ],
              },
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: {
                    exclude: ["status", "userId", "createdAt", "updatedAt"],
                  },
                },
              ],
            },
            {
              model: ItemOrdStatus,
              as: "itemStatus",
              attributes: {
                exclude: ["status", "userId", "createdAt", "updatedAt"],
              },
            },
          ],
        },
      ],
      where: { id: orderId },
      raw: false, // Dejamos raw en `false` para que los datos anidados se mantengan
      nest: true, // Esto permite que los resultados anidados se estructuren correctamente
      order: [["createdAt", "DESC"]], // Ordenar por fecha de creación descend
    });

    return NEW_RESPONSE(0, "", order.get({ plain: true }) as OrderDTO);
  } catch (error) {
    return NEW_RESPONSE(-1, "Error inesperado al consultar: " + error);
  }
}

export async function updateStatusItemOrder(
  orderId: string,
  itemOrderId: string,
  userId: number
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    // 1. Buscar el detalle
    const itemOrder = await OrderDetail.findOne({
      where: { id: itemOrderId, orderId: orderId },
      transaction,
    });
    if (!itemOrder) {
      throw new Error("Item no encontrado");
    }

    const configStatus = await ItemOrdStatus.findOne({
      where: { id: itemOrder.status },
      transaction,
    });

    // 2. Validar que no esté finalizado
    if (configStatus.completed) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "No hay más estados para avanzar.");
    }

    // 3. Incrementar secuencia del ítem
    itemOrder.status = itemOrder.status + 1;
    itemOrder.userId = userId;
    itemOrder.updatedAt = new Date();
    await itemOrder.save({ transaction });

    // registrar en SyncQueue para el detalle
    await upsertSyncQueue(
      {
        tableName: "order_details",
        recordId: itemOrder.id,
        action: "update",
        userId,
      },
      transaction
    );

    // 4. Si el estado de la orden es menor al estado actual del ítem → actualizar cabecera
    if (configStatus.changeStatus) {
      const order = await Order.findByPk(orderId, { transaction });

      if (order && order.status < itemOrder.status) {
        order.userId = userId;
        order.status = itemOrder.status;
        order.updatedAt = new Date();
        await order.save({ transaction });

        await upsertSyncQueue(
          {
            tableName: "orders",
            recordId: orderId,
            action: "update",
            userId,
          },
          transaction
        );
      }
    }

    // 5. Validación de cabecera (buscar máxima secuencia de los detalles)
    const configCancel = await ItemOrdStatus.findOne({
      where: { sequence: 0 },
      transaction,
    });

    const maxSequence = await OrderDetail.max("odt_status", {
      where: {
        orderId,
        status: { [Op.ne]: configCancel.id },
      },
      transaction,
    });

    const pendingItems = await OrderDetail.count({
      where: {
        orderId,
        status: {
          [Op.lt]: maxSequence,
          [Op.ne]: configCancel.id,
        },
      },
      transaction,
    });

    if (pendingItems === 0) {
      const order = await Order.findByPk(orderId, { transaction });

      if (order && order.status < maxSequence) {
        order.status = maxSequence;
        order.userId = userId;
        order.updatedAt = new Date();
        await order.save({ transaction });

        await upsertSyncQueue(
          {
            tableName: "orders",
            recordId: orderId,
            action: "update",
            userId,
          },
          transaction
        );
      }
    }

    await transaction.commit();

    const _order = await getOrder(orderId);
    return NEW_RESPONSE(0, "", _order.data);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(-1, "Error inesperado al actualizar estado: " + error);
  }
}

export async function UpdateQuantityItemsOrder(
  orderId: string,
  orderItemId: string,
  quantity: number,
  userId: number
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    // 1. Buscar el detalle
    const itemOrder = await OrderDetail.findOne({
      where: { id: orderItemId, orderId },
      transaction,
    });

    if (!itemOrder) {
      throw new Error("Item no encontrado");
    }

    // 2. Validar estado
    const configStatus = await ItemOrdStatus.findOne({
      where: { id: itemOrder.status },
      transaction,
    });

    if (configStatus?.paramStatus === "CANCELED") {
      await transaction.rollback();
      return NEW_RESPONSE(1, "Este item ya fue cancelado.");
    }

    // 3. Actualizar cantidad
    itemOrder.quantity = quantity;
    itemOrder.userId = userId;
    await itemOrder.save({ transaction });

    // 4. Insertar/actualizar en SyncQueue para sincronizar después
    await upsertSyncQueue(
      {
        tableName: "order_details",
        recordId: itemOrder.id,
        action: "update",
        userId: userId,
      },
      transaction
    );

    // 5. Commit
    await transaction.commit();

    // 6. Retornar orden actualizada (fuera de la transacción)
    const _order = await getOrder(orderId);

    return NEW_RESPONSE(0, "Cantidad actualizada", _order.data);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(-1, "Error inesperado al actualizar: " + error);
  }
}

export async function cancelItemOrder(
  orderId: string,
  itemOrderId: string,
  userId: number
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    // 1. Buscar el detalle
    const itemOrder = await OrderDetail.findOne({
      where: { id: itemOrderId, orderId: orderId },
      transaction,
    });
    if (!itemOrder) {
      throw new Error("Item no encontrado");
    }

    const configStatus = await ItemOrdStatus.findOne({
      where: { id: itemOrder.status },
      transaction,
    });

    // 2. Validar que no esté finalizado
    if (configStatus.completed) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "No hay más estados para avanzar.");
    }

    const configCancel = await ItemOrdStatus.findOne({
      where: { sequence: 0 },
      transaction,
    });

    // 3. Actualizar estado a cancelado
    itemOrder.status = configCancel.id;
    itemOrder.updatedAt = new Date();
    await itemOrder.save({ transaction });

    // 4. Insertar/actualizar SyncQueue para el detalle
    await upsertSyncQueue(
      {
        tableName: "order_details",
        recordId: itemOrder.id,
        action: "update",
        userId,
      },
      transaction
    );

    // 5. Validación de cabecera
    const totalItems = await OrderDetail.count({
      where: { orderId },
      transaction,
    });

    const canceledItems = await OrderDetail.count({
      where: {
        orderId,
        status: configCancel.id,
      },
      transaction,
    });

    if (totalItems > 0 && totalItems === canceledItems) {
      const configCancelOrder = await OrderStatus.findOne({
        where: { sequence: 0 },
        transaction,
      });

      if (configCancelOrder) {
        await Order.update(
          { status: configCancelOrder.id, updatedAt: new Date(), userId },
          { where: { id: orderId }, transaction }
        );

        // 👇 también insertamos en SyncQueue para la cabecera
        await upsertSyncQueue(
          {
            tableName: "orders",
            recordId: orderId,
            action: "update",
            userId,
          },
          transaction
        );
      }
    }

    await transaction.commit();

    const _order = await getOrder(orderId);

    return NEW_RESPONSE(0, "", _order.data);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(-1, "Error inesperado al cancelar item: " + error);
  }
}

export async function cancelOrder(
  orderId: string,
  userId: number
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    // 1. Buscar la orden
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) {
      throw new Error("Orden no encontrada");
    }

    // 2. Verificar que la orden no esté ya finalizada
    const configOrderStatus = await OrderStatus.findOne({
      where: { id: order.status },
      transaction,
    });

    if (configOrderStatus?.completed) {
      await transaction.rollback();
      return NEW_RESPONSE(
        1,
        "La orden ya está finalizada, no puede cancelarse."
      );
    }

    // 3. Estados de cancelación
    const configCancelItem = await ItemOrdStatus.findOne({
      where: { sequence: 0 },
      transaction,
    });
    const configCancelOrder = await OrderStatus.findOne({
      where: { sequence: 0 },
      transaction,
    });

    if (!configCancelItem || !configCancelOrder) {
      throw new Error("No existe configuración de estados de cancelación.");
    }

    // 4. Cancelar todos los ítems asociados a la orden
    const items = await OrderDetail.findAll({
      where: { orderId },
      transaction,
    });

    for (const item of items) {
      item.status = configCancelItem.id;
      item.notes = "PRODUCTO CANCELADO";
      item.userId = userId;
      item.updatedAt = new Date();
      await item.save({ transaction });

      // insertar/actualizar en SyncQueue cada ítem
      await upsertSyncQueue(
        {
          tableName: "order_details",
          recordId: item.id,
          action: "update",
          userId,
        },
        transaction
      );
    }

    // 5. Cancelar la cabecera de la orden
    order.status = configCancelOrder.id;
    order.notes = "Orden Cancelada";
    if (userId) order.userId = userId;
    order.updatedAt = new Date();
    await order.save({ transaction });

    // insertar/actualizar en SyncQueue cabecera
    await upsertSyncQueue(
      {
        tableName: "orders",
        recordId: orderId,
        action: "update",
        userId,
      },
      transaction
    );

    // 6. Confirmar transacción
    await transaction.commit();

    // 7. Retornar la orden actualizada
    const _order = await getOrder(orderId);
    return NEW_RESPONSE(0, "Orden cancelada exitosamente", _order.data);
  } catch (error) {
    // rollback si algo falla
    await transaction.rollback();
    return NEW_RESPONSE(-1, "Error inesperado al cancelar orden: " + error);
  }
}

export async function invoiceOrder(
  orderId: string,
  customerId: number,
  tip: number,
  paymentMethod: string,
  invoiceElectronic: boolean = false,
  userId: number = 999 // para registrar quién facturó
): Promise<RESPONSE<OrderDTO>> {
  const transaction = await sequelize.transaction();
  try {
    // 1. Buscar la orden
    const order = await Order.findByPk(orderId, { transaction });
    if (!order) throw new Error("Orden no encontrada");

    //Validar si es factura electronica
    if (invoiceElectronic) {
      order.customerId = customerId;
    }

    // 2. Buscar status cancelado
    const configCancelItem = await ItemOrdStatus.findOne({
      where: { sequence: 0 },
      transaction,
    });
    if (!configCancelItem) throw new Error("Config cancel item no encontrado");

    // 3. Traer items de la orden no cancelados
    const orderDetails = await OrderDetail.findAll({
      where: { orderId, status: { [Op.ne]: configCancelItem.id } },
      include: [
        {
          model: MenuItem,
          as: "menuItem",
          attributes: ["price"],
          include: [
            {
              model: Product,
              as: "product",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      transaction,
    });
    if (orderDetails.length === 0)
      throw new Error("No hay ítems para facturar");

    // 4. Calcular subtotal y total
    const subTotal = orderDetails.reduce((acc: number, item: OrderDetail) => {
      return acc + Number(item.menuItem?.price) * item.quantity;
    }, 0);
    const total = subTotal + Number(tip ?? 0);

    // 5. Cambiar estado orden
    const configInvoiceOrder = await OrderStatus.findOne({
      where: { paramStatus: "INVOICED" },
      transaction,
    });
    if (!configInvoiceOrder) throw new Error("Estado INVOICED no encontrado");

    order.status = configInvoiceOrder.id;
    order.tip = tip;
    order.total = total;
    order.updatedAt = new Date();
    await order.save({ transaction });

    // insertar/actualizar en SyncQueue orden
    await upsertSyncQueue(
      {
        tableName: "orders",
        recordId: order.id,
        action: "update",
        userId,
      },
      transaction
    );

    // 6. Crear la cabecera de la factura
    const invNumber = `F${Date.now()}`; // ejemplo temporal

    const invoice = await Invoice.create(
      {
        number: invNumber,
        orderId: order.id,
        customerId: order.customerId,
        subtotal: subTotal,
        tip: tip,
        tax: 0, // por ahora sin IVA
        total: total,
        paymentMethod: paymentMethod,
        userId: userId,
        status: 1, // activa
      },
      { transaction }
    );

    // insertar en SyncQueue cabecera de factura
    await upsertSyncQueue(
      {
        tableName: "invoices",
        recordId: invoice.id,
        action: "insert",
        userId,
      },
      transaction
    );

    // 7. Crear items de la factura
    const invoiceItemsData = orderDetails.map((item: OrderDetail) => ({
      invoiceId: invoice.id,
      productId: item.menuItem.product.id,
      description: item.menuItem.product.name,
      quantity: item.quantity,
      unitPrice: item.menuItem.price,
      discount: 0,
      total: Number(item.menuItem.price) * item.quantity,
      taxRate: 0,
      taxAmount: 0,
      notes: item.notes ?? null,
      userId: userId,
      status: 1,
    }));

    const invoiceItems = await InvoiceItem.bulkCreate(invoiceItemsData, {
      transaction,
      returning: true,
    });

    // insertar en SyncQueue cada item de la factura
    for (const invItem of invoiceItems) {
      await upsertSyncQueue(
        {
          tableName: "invoice_items",
          recordId: invItem.id,
          action: "insert",
          userId,
        },
        transaction
      );
    }

    // 8. Commit
    await transaction.commit();

    const _order = await getOrder(orderId);

    return NEW_RESPONSE(0, "Facturado ", _order.data);
  } catch (error) {
    // Rollback
    await transaction.rollback();
    return NEW_RESPONSE(-1, "Error inesperado al generar factura: " + error);
  }
}
