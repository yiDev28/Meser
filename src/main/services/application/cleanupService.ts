/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { Op } = require("sequelize");
import { sequelize } from "@/main/db/db";
import CleanupLog from "@/main/models/Shared/CleanupLogModel";
import Order from "@/main/models/Order/OrderModel";
import OrderDetail from "@/main/models/Order/OrderDetailsModel";
import OrderMetadata from "@/main/models/Order/OrderMetadataModel";
import Invoices from "@/main/models/Invoice/InvoiceModel";
import InvoicesItems from "@/main/models/Invoice/InvoiceItemModel";
import InvoicesSurcharges from "@/main/models/Invoice/InvoiceSurchargeModel";
import { CashRegister } from "@/main/models/Cash/CashRegisterModel";
import { CashMovement } from "@/main/models/Cash/CashMovementModel";
import { SyncQueue } from "@/main/models/Shared/syncQueueModel";
import { STATUS_ENUM } from "@/interfaces/const/status.const";

interface CleanupResult {
  tableName: string;
  action: string;
  recordsCount: number;
  status: string;
  errorMessage: string | null;
}

function getDaysToKeep(): number {
  const envValue = process.env.CLEANUP_DAYS_TO_KEEP;
  const days = parseInt(envValue || "7", 10);
  return isNaN(days) ? 7 : days;
}

export function getCleanupDaysFromConfig(configValue?: string | number): number {
  const days = parseInt(String(configValue || getDaysToKeep()), 10);
  return isNaN(days) ? 7 : days;
}

function getLogsDaysToKeep(): number {
  const envValue = process.env.CLEANUP_LOGS_DAYS_TO_KEEP;
  const days = parseInt(envValue || "60", 10);
  return isNaN(days) ? 60 : days;
}

async function logCleanup(result: CleanupResult): Promise<void> {
  if (result.recordsCount <= 0) return;
  
  try {
    await CleanupLog.create({
      tableName: result.tableName,
      action: result.action,
      recordsCount: result.recordsCount,
      status: result.status,
      errorMessage: result.errorMessage,
      executedAt: new Date(),
    });
  } catch (error) {
    console.error("[cleanup] Error al guardar log:", error);
  }
}

async function isInSyncQueue(tableName: string, recordId: string): Promise<boolean> {
  const exists = await SyncQueue.findOne({
    where: {
      tableName,
      recordId,
    },
  });
  return !!exists;
}

async function markOrdersAsDeleted(daysOld: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const orders = await Order.findAll({
    where: {
      createdAt: { [Op.lt]: cutoffDate },
      status: { [Op.ne]: STATUS_ENUM.DELETED },
    },
  });

  let markedCount = 0;

  for (const order of orders) {
    const inQueue = await isInSyncQueue("orders", order.id);
    if (!inQueue) {
      await sequelize.transaction(async (transaction: any) => {
        await Order.update(
          { status: STATUS_ENUM.DELETED },
          { where: { id: order.id }, transaction }
        );

        await OrderDetail.update(
          { status: STATUS_ENUM.DELETED },
          { where: { orderId: order.id }, transaction }
        );

        await OrderMetadata.update(
          { status: STATUS_ENUM.DELETED },
          { where: { orderId: order.id }, transaction }
        );

        markedCount++;
      });
    }
  }

  return markedCount;
}

async function markInvoicesAsDeleted(daysOld: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const invoices = await Invoices.findAll({
    where: {
      createdAt: { [Op.lt]: cutoffDate },
      status: { [Op.ne]: STATUS_ENUM.DELETED },
    },
  });

  let markedCount = 0;

  for (const invoice of invoices) {
    const inQueue = await isInSyncQueue("invoices", invoice.id);
    if (!inQueue) {
      await sequelize.transaction(async (transaction: any) => {
        await Invoices.update(
          { status: STATUS_ENUM.DELETED },
          { where: { id: invoice.id }, transaction }
        );

        await InvoicesItems.update(
          { status: STATUS_ENUM.DELETED },
          { where: { invoiceId: invoice.id }, transaction }
        );

        await InvoicesSurcharges.update(
          { status: STATUS_ENUM.DELETED },
          { where: { invoiceId: invoice.id }, transaction }
        );

        markedCount++;
      });
    }
  }

  return markedCount;
}

async function markCashRegistersAsDeleted(daysOld: number): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const cashRegisters = await CashRegister.findAll({
    where: {
      createdAt: { [Op.lt]: cutoffDate },
      status: { [Op.ne]: STATUS_ENUM.DELETED },
    },
  });

  let markedCount = 0;

  for (const cashRegister of cashRegisters) {
    const inQueue = await isInSyncQueue("cash_registers", cashRegister.id);
    if (!inQueue) {
      await sequelize.transaction(async (transaction: any) => {
        await CashRegister.update(
          { status: STATUS_ENUM.DELETED },
          { where: { id: cashRegister.id }, transaction }
        );

        await CashMovement.update(
          { status: STATUS_ENUM.DELETED },
          { where: { cashRegisterId: cashRegister.id }, transaction }
        );

        markedCount++;
      });
    }
  }

  return markedCount;
}

async function deleteOrderDetails(orderIds: string[]): Promise<number> {
  if (orderIds.length === 0) return 0;
  
  const deletedMetadata = await OrderMetadata.destroy({
    where: { orderId: { [Op.in]: orderIds }, status: STATUS_ENUM.DELETED },
  });

  const deletedDetails = await OrderDetail.destroy({
    where: { orderId: { [Op.in]: orderIds }, status: STATUS_ENUM.DELETED },
  });

  return deletedMetadata + deletedDetails;
}

async function deleteOrders(orderIds: string[]): Promise<number> {
  if (orderIds.length === 0) return 0;
  return Order.destroy({
    where: { id: { [Op.in]: orderIds }, status: STATUS_ENUM.DELETED },
  });
}

async function deleteInvoiceItems(invoiceIds: string[]): Promise<number> {
  if (invoiceIds.length === 0) return 0;

  const deletedSurcharges = await InvoicesSurcharges.destroy({
    where: { invoiceId: { [Op.in]: invoiceIds }, status: STATUS_ENUM.DELETED },
  });

  const deletedItems = await InvoicesItems.destroy({
    where: { invoiceId: { [Op.in]: invoiceIds }, status: STATUS_ENUM.DELETED },
  });

  return deletedSurcharges + deletedItems;
}

async function deleteInvoices(invoiceIds: string[]): Promise<number> {
  if (invoiceIds.length === 0) return 0;
  return Invoices.destroy({
    where: { id: { [Op.in]: invoiceIds }, status: STATUS_ENUM.DELETED },
  });
}

async function deleteCashMovements(cashRegisterIds: string[]): Promise<number> {
  if (cashRegisterIds.length === 0) return 0;
  return CashMovement.destroy({
    where: { cashRegisterId: { [Op.in]: cashRegisterIds }, status: STATUS_ENUM.DELETED },
  });
}

async function deleteCashRegisters(cashRegisterIds: string[]): Promise<number> {
  if (cashRegisterIds.length === 0) return 0;
  return CashRegister.destroy({
    where: { id: { [Op.in]: cashRegisterIds }, status: STATUS_ENUM.DELETED },
  });
}

async function purgeCleanupLogs(): Promise<number> {
  const daysToKeep = getLogsDaysToKeep();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

  const deleted = await CleanupLog.destroy({
    where: {
      executedAt: { [Op.lt]: cutoffDate },
    },
  });

  return deleted;
}

export async function cleanupOldRecords(daysFromConfig?: number): Promise<void> {
  console.log("[cleanup] Iniciando limpieza de registros antiguos...");
  
  const daysToKeep = daysFromConfig || getDaysToKeep();
  console.log(`[cleanup] Días a retener: ${daysToKeep}`);

  try {
    // Step 1: Marcar como DELETED
    console.log("[cleanup] Step 1: Marcando registros como DELETED...");

    const ordersMarked = await markOrdersAsDeleted(daysToKeep);
    console.log(`[cleanup] Orders marcadas: ${ordersMarked}`);
    await logCleanup({
      tableName: "orders",
      action: "mark_deleted",
      recordsCount: ordersMarked,
      status: "success",
      errorMessage: null,
    });

    const invoicesMarked = await markInvoicesAsDeleted(daysToKeep);
    console.log(`[cleanup] Invoices marcadas: ${invoicesMarked}`);
    await logCleanup({
      tableName: "invoices",
      action: "mark_deleted",
      recordsCount: invoicesMarked,
      status: "success",
      errorMessage: null,
    });

    const cashRegistersMarked = await markCashRegistersAsDeleted(daysToKeep);
    console.log(`[cleanup] CashRegisters marcados: ${cashRegistersMarked}`);
    await logCleanup({
      tableName: "cash_registers",
      action: "mark_deleted",
      recordsCount: cashRegistersMarked,
      status: "success",
      errorMessage: null,
    });

    // Step 2: Eliminar físicamente
    console.log("[cleanup] Step 2: Eliminando registros marcados físicamente...");

    // Eliminar en orden: detalles primero → luego cabeceras
    
    // Orders
    const deletedOrderDetails = await deleteOrderDetails(
      (await Order.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((o: Order) => o.id)
    );
    console.log(`[cleanup] Order details eliminados: ${deletedOrderDetails}`);
    
    const deletedOrders = await deleteOrders(
      (await Order.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((o: Order) => o.id)
    );
    console.log(`[cleanup] Orders eliminadas: ${deletedOrders}`);
    await logCleanup({
      tableName: "orders",
      action: "delete_physical",
      recordsCount: deletedOrders,
      status: "success",
      errorMessage: null,
    });

    // Invoices
    const deletedInvoiceItems = await deleteInvoiceItems(
      (await Invoices.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((i: Invoices) => i.id)
    );
    console.log(`[cleanup] Invoice items eliminados: ${deletedInvoiceItems}`);

    const deletedInvoices = await deleteInvoices(
      (await Invoices.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((i: Invoices) => i.id)
    );
    console.log(`[cleanup] Invoices eliminadas: ${deletedInvoices}`);
    await logCleanup({
      tableName: "invoices",
      action: "delete_physical",
      recordsCount: deletedInvoices,
      status: "success",
      errorMessage: null,
    });

    // Cash Registers
    const deletedCashMovements = await deleteCashMovements(
      (await CashRegister.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((c: CashRegister) => c.id)
    );
    console.log(`[cleanup] Cash movements eliminados: ${deletedCashMovements}`);

    const deletedCashRegisters = await deleteCashRegisters(
      (await CashRegister.findAll({ 
        where: { status: STATUS_ENUM.DELETED },
        attributes: ["id"]
      })).map((c: CashRegister) => c.id)
    );
    console.log(`[cleanup] Cash registers eliminados: ${deletedCashRegisters}`);
    await logCleanup({
      tableName: "cash_registers",
      action: "delete_physical",
      recordsCount: deletedCashRegisters,
      status: "success",
      errorMessage: null,
    });

    console.log("[cleanup] Limpieza completada exitosamente");

    // Step 3: Purge old cleanup logs
    console.log("[cleanup] Step 3: Purge old cleanup logs...");
    const purgedLogs = await purgeCleanupLogs();
    console.log(`[cleanup] Logs eliminados: ${purgedLogs}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[cleanup] Error durante la limpieza:", errorMessage);
    
    await logCleanup({
      tableName: "general",
      action: "cleanup_error",
      recordsCount: 0,
      status: "error",
      errorMessage,
    });
  }
}