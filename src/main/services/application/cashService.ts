import { createRequire } from "node:module";
import { sequelize } from "@/main/db/db";
import { CashRegister } from "@/main/models/Cash/CashRegisterModel";
import { CashMovement } from "@/main/models/Cash/CashMovementModel";
import { CashTypeMovement } from "@/main/models/Cash/CashTypeMoveModel";
import User from "@/main/models/User/UserModel";
import TypePayment from "@/main/models/Invoice/TypePaymentModel";
import { upsertSyncQueue } from "./syncPushService";
import { getErrorMessage } from "@/utils/errorUtils";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import { STATUS_ENUM } from "@/interfaces/const/status.const";
import { SCOPE_ENUM } from "@/interfaces/const/scope.const";
import {
  CashRegisterDTO,
  CashMovementDTO,
  TypeMovementDTO,
  OpenCashRegisterDTO,
  CreateCashMovementDTO,
  CloseCashRegisterDTO,
  CashSummaryDTO,
  CASH_MOVEMENT_MODE,
} from "@/interfaces/cash";
import { Transaction } from "sequelize";

const require = createRequire(import.meta.url);
const { Op } = require("sequelize");

export async function openCashRegister(
  data: OpenCashRegisterDTO,
): Promise<RESPONSE<CashRegisterDTO>> {
  const transaction = await sequelize.transaction();
  try {
    const existingOpen = await CashRegister.findOne({
      where: { userId: data.userId, isOpen: true },
      transaction,
    });

    if (existingOpen) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "Ya existe una caja abierta para este usuario.");
    }

    const cashRegister = await CashRegister.create(
      {
        openedAt: new Date(),
        initialAmount: data.initialAmount,
        isOpen: true,
        userId: data.userId,
      },
      { transaction },
    );

    await upsertSyncQueue(
      {
        tableName: "cash_registers",
        recordId: String(cashRegister.id),
        action: "insert",
        userId: data.userId,
      },
      transaction,
    );

    await transaction.commit();

    const result = await getCashRegisterById(cashRegister.id);
    return NEW_RESPONSE(0, "Caja abierta exitosamente", result);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(
      -1,
      "Error al abrir caja: " + getErrorMessage(error),
    );
  }
}

export async function closeCashRegister(
  data: CloseCashRegisterDTO,
): Promise<RESPONSE<CashRegisterDTO>> {
  const transaction = await sequelize.transaction();
  try {
    const cashRegister = await CashRegister.findByPk(data.cashRegisterId, {
      transaction,
    });

    if (!cashRegister) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "Caja no encontrada.");
    }

    if (!cashRegister.isOpen) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "La caja ya está cerrada.");
    }

    cashRegister.closedAt = new Date();
    cashRegister.isOpen = false;
    cashRegister.status = STATUS_ENUM.ACTIVE;
    await cashRegister.save({ transaction });

    await upsertSyncQueue(
      {
        tableName: "cash_registers",
        recordId: String(cashRegister.id),
        action: "update",
        userId: data.userId,
      },
      transaction,
    );

    await transaction.commit();

    const result = await getCashRegisterById(cashRegister.id);
    return NEW_RESPONSE(0, "Caja cerrada exitosamente", result);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(
      -1,
      "Error al cerrar caja: " + getErrorMessage(error),
    );
  }
}

export async function getCurrentCashRegister(
  userId: number,
): Promise<RESPONSE<CashRegisterDTO | null>> {
  try {
    console.log("getCurrentCashRegister called with userId:", userId);
    
    const cashRegister = await CashRegister.findOne({
      where: { userId, isOpen: true },
      order: [["openedAt", "DESC"]],
    });
    
    console.log("CashRegister found:", cashRegister ? "yes" : "no");
    if (cashRegister) {
      console.log("CashRegister data:", {
        id: cashRegister.id,
        isOpen: cashRegister.isOpen,
        userId: cashRegister.userId,
        initialAmount: cashRegister.initialAmount
      });
    }

    if (!cashRegister) {
      return NEW_RESPONSE(0, "No hay caja abierta", null);
    }

    const movements = await CashMovement.findAll({
      where: { cashRegisterId: cashRegister.id },
      include: [{
        model: CashTypeMovement,
        as: "typeMovementData",
        attributes: ["affectsMode"]
      }],
    });

    const plainMovements: MovementWithType[] = movements.map((m: CashMovement) => {
      const plain = m.get({ plain: true }) as MovementWithType;
      return plain;
    });
    
    const currentAmount = calculateCurrentAmount(
      Number(cashRegister.initialAmount),
      plainMovements,
    );

    const dto: CashRegisterDTO = {
      id: String(cashRegister.id),
      openedAt: String(cashRegister.openedAt),
      closedAt: cashRegister.closedAt ? String(cashRegister.closedAt) : undefined,
      initialAmount: Number(cashRegister.initialAmount),
      currentAmount: currentAmount,
      isOpen: Boolean(cashRegister.isOpen),
      userId: Number(cashRegister.userId),
      status: Number(cashRegister.status),
    };

    return NEW_RESPONSE(0, "", dto);
  } catch (error) {
    console.error("Error in getCurrentCashRegister:", error);
    return NEW_RESPONSE(
      -1,
      "Error al obtener caja: " + getErrorMessage(error),
    );
  }
}

export async function getCashMovements(
  cashRegisterId: string,
): Promise<RESPONSE<CashMovementDTO[]>> {
  try {
    const movements = await CashMovement.findAll({
      where: { cashRegisterId, status: STATUS_ENUM.ACTIVE },
      include: [
        {
          model: CashTypeMovement,
          as: "typeMovementData",
          attributes: ["id", "description", "affectsCash", "affectsMode"],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    let runningBalance = 0;
    const movementsWithBalance = movements.map((m: CashMovement) => {
      const plain = m.get({ plain: true }) as CashMovement & {
        typeMovementData?: TypeMovementDTO;
        user?: User;
      };

      if (plain.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.ENTRY) {
        runningBalance += Number(m.amount);
      } else if (plain.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.EXIT) {
        runningBalance -= Number(m.amount);
      }

      return {
        ...plain,
        balance: runningBalance,
        userName: plain.user?.username,
        typeMovement: plain.typeMovementData,
      } as CashMovementDTO;
    });

    return NEW_RESPONSE(0, "", movementsWithBalance);
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error al obtener movimientos: " + getErrorMessage(error),
    );
  }
}

export async function createCashMovement(
  data: CreateCashMovementDTO,
): Promise<RESPONSE<CashMovementDTO>> {
  const transaction = await sequelize.transaction();
  try {
    const cashRegister = await CashRegister.findByPk(
      data.cashRegisterId,
      { transaction },
    );

    if (!cashRegister) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "Caja no encontrada.");
    }

    if (!cashRegister.isOpen) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "La caja está cerrada.");
    }

    const typeMovement = await CashTypeMovement.findByPk(data.typeMovementId, {
      transaction,
    });

    if (!typeMovement) {
      await transaction.rollback();
      return NEW_RESPONSE(1, "Tipo de movimiento no encontrado.");
    }

    const movement = await CashMovement.create(
      {
        cashRegisterId: cashRegister.id,
        typeMovement: data.typeMovementId,
        amount: data.amount,
        description: data.description,
        status: STATUS_ENUM.ACTIVE,
        userId: data.userId,
      },
      { transaction },
    );

    await upsertSyncQueue(
      {
        tableName: "cash_movements",
        recordId: String(movement.id),
        action: "insert",
        userId: data.userId,
      },
      transaction,
    );

    await transaction.commit();

    const result = await getMovementById(movement.id);
    return NEW_RESPONSE(0, "Movimiento registrado", result);
  } catch (error) {
    await transaction.rollback();
    return NEW_RESPONSE(
      -1,
      "Error al crear movimiento: " + getErrorMessage(error),
    );
  }
}

export async function createSaleMovement(
  invoiceId: string,
  cashRegisterId: string,
  amount: number,
  paymentMethodId: number,
  userId: number,
  transaction: Transaction,
): Promise<void> {
  try {
    const typePayment = await TypePayment.findByPk(paymentMethodId, { transaction });
    
    if (typePayment?.affectsCash !== true) {
      console.log("Pago no afecta caja, omitiendo movimiento de efectivo");
      return;
    }

    const saleTypeMovement = await CashTypeMovement.findOne({
      where: {
        affectsMode: 1,
        affectsCash: 1,
        status: STATUS_ENUM.ACTIVE,
        scope: SCOPE_ENUM.GLOBAL,
      },
      transaction,
    });

    if (!saleTypeMovement) {
      console.warn("No se encontró tipo de movimiento para ventas");
      return;
    }

    const movement = await CashMovement.create(
      {
        cashRegisterId: cashRegisterId,
        typeMovement: saleTypeMovement.id,
        description: `Venta - Factura ${invoiceId}`,
        amount: amount,
        status: STATUS_ENUM.ACTIVE,
        userId: userId,
      },
      { transaction },
    );

    await upsertSyncQueue(
      {
        tableName: "cash_movements",
        recordId: String(movement.id),
        action: "insert",
        userId: userId,
      },
      transaction,
    );
  } catch (error) {
    console.error("Error creating sale movement:", error);
  }
}

export async function getTypeMovements(): Promise<RESPONSE<TypeMovementDTO[]>> {
  try {
    const types = await CashTypeMovement.findAll({
      where: {
        status: STATUS_ENUM.ACTIVE,
        scope: [SCOPE_ENUM.GLOBAL, SCOPE_ENUM.CLIENT],
      },
      attributes: ["id", "description", "affectsCash", "affectsMode"],
      order: [["description", "ASC"]],
    });

    return NEW_RESPONSE(
      0,
      "",
      types.map((t: CashTypeMovement) => t.get({ plain: true }) as TypeMovementDTO),
    );
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error al obtener tipos de movimiento: " + getErrorMessage(error),
    );
  }
}

export async function getCashSummary(
  cashRegisterId: string,
): Promise<RESPONSE<CashSummaryDTO>> {
  try {
    const cashRegister = await CashRegister.findByPk(cashRegisterId);
    if (!cashRegister) {
      return NEW_RESPONSE(1, "Caja no encontrada.");
    }

    const movements = await CashMovement.findAll({
      where: { cashRegisterId },
      include: [
        {
          model: CashTypeMovement,
          as: "typeMovementData",
          attributes: ["id", "affectsMode"],
        },
      ],
    });

    let totalIn = 0;
    let totalOut = 0;
    let salesTotal = 0;

    for (const m of movements) {
      const plain = m.get({ plain: true }) as CashMovement & {
        typeMovementData?: { affectsMode: number };
      };
      const amount = Number(plain.amount);

      if (plain.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.ENTRY) {
        totalIn += amount;
      } else if (plain.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.EXIT) {
        totalOut += amount;
      }
    }

    salesTotal = totalIn;

    const currentAmount = calculateCurrentAmount(
      cashRegister.initialAmount,
      movements as CashMovement[],
    );

    const summary: CashSummaryDTO = {
      initialAmount: Number(cashRegister.initialAmount),
      totalIn,
      totalOut,
      salesTotal,
      otherInTotal: totalIn - salesTotal,
      currentAmount,
      difference: currentAmount - Number(cashRegister.initialAmount),
      movementsCount: movements.length,
    };

    return NEW_RESPONSE(0, "", summary);
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error al obtener resumen: " + getErrorMessage(error),
    );
  }
}

async function getCashRegisterById(id: string): Promise<CashRegisterDTO | null> {
  const cashRegister = await CashRegister.findByPk(id, {
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
  });

  if (!cashRegister) return null;

  const movements = await CashMovement.findAll({
    where: { cashRegisterId: id },
    include: [{
      model: CashTypeMovement,
      as: "typeMovementData",
      attributes: ["affectsMode"]
    }]
  });

  const plainMovements: MovementWithType[] = movements.map((m: CashMovement) => {
    return m.get({ plain: true }) as MovementWithType;
  });
  
  const currentAmount = calculateCurrentAmount(
    Number(cashRegister.initialAmount),
    plainMovements,
  );

  return {
    id: String(cashRegister.id),
    openedAt: String(cashRegister.openedAt),
    closedAt: cashRegister.closedAt ? String(cashRegister.closedAt) : undefined,
    initialAmount: Number(cashRegister.initialAmount),
    currentAmount: currentAmount,
    isOpen: Boolean(cashRegister.isOpen),
    userId: Number(cashRegister.userId),
    status: Number(cashRegister.status),
  };
}

async function getMovementById(id: string): Promise<CashMovementDTO | null> {
  const movement = await CashMovement.findByPk(id, {
    include: [
      {
        model: CashTypeMovement,
        as: "typeMovementData",
        attributes: ["id", "description", "affectsCash", "affectsMode"],
      },
      {
        model: User,
        as: "user",
        attributes: ["id", "username"],
      },
    ],
  });

  if (!movement) return null;

  const plain = movement.get({ plain: true }) as CashMovement & {
    typeMovementData?: TypeMovementDTO;
    user?: User;
  };

  const movements = await CashMovement.findAll({
    where: {
      cashRegisterId: plain.cashRegisterId,
      createdAt: { [Op.lte]: movement.createdAt },
    },
    order: [["createdAt", "ASC"]],
  });

  let balance = 0;
  for (const m of movements) {
    const mPlain = m.get({ plain: true }) as CashMovement & {
      typeMovementData?: { affectsMode: number };
    };
    const cashMovement = await CashTypeMovement.findByPk(mPlain.typeMovement);
    if (cashMovement?.affectsMode === CASH_MOVEMENT_MODE.ENTRY) {
      balance += Number(m.amount);
    } else if (cashMovement?.affectsMode === CASH_MOVEMENT_MODE.EXIT) {
      balance -= Number(m.amount);
    }
  }

  const { typeMovementData, user, ...rest } = plain;
  void typeMovementData;
  void user;
  
  return {
    id: rest.id,
    cashRegisterId: rest.cashRegisterId,
    amount: rest.amount,
    userId: rest.userId,
    createdAt: rest.createdAt,
    description: rest.description,
    balance,
    userName: plain.user?.username,
    typeMovement: plain.typeMovementData as TypeMovementDTO,
  } as CashMovementDTO;
}

interface MovementWithType {
  amount: number | string;
  typeMovement?: number;
  typeMovementData?: { affectsMode: number };
}

function calculateCurrentAmount(
  initialAmount: number,
  movements: MovementWithType[],
): number {
  let total = Number(initialAmount);

  for (const m of movements) {
    const movement = m as MovementWithType;
    if (movement.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.ENTRY) {
      total += Number(movement.amount);
    } else if (movement.typeMovementData?.affectsMode === CASH_MOVEMENT_MODE.EXIT) {
      total -= Number(movement.amount);
    }
  }

  return total;
}
