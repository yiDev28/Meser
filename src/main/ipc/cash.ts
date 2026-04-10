import { ipcMain } from "electron";
import { NEW_RESPONSE, RESPONSE } from "@/interfaces/response";
import {
  CashRegisterDTO,
  CashMovementDTO,
  TypeMovementDTO,
  OpenCashRegisterDTO,
  CreateCashMovementDTO,
  CloseCashRegisterDTO,
  CashSummaryDTO,
} from "@/interfaces/cash";
import {
  openCashRegister,
  closeCashRegister,
  getCurrentCashRegister,
  getCashMovements,
  createCashMovement,
  getTypeMovements,
  getCashSummary,
} from "../services/application/cashService";
import { getErrorMessage } from "@/utils/errorUtils";

ipcMain.handle(
  "open-cash-register",
  async (
    _event,
    data: OpenCashRegisterDTO,
  ): Promise<RESPONSE<CashRegisterDTO>> => {
    try {
      return await openCashRegister(data);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al abrir caja: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "close-cash-register",
  async (
    _event,
    data: CloseCashRegisterDTO,
  ): Promise<RESPONSE<CashRegisterDTO>> => {
    try {
      return await closeCashRegister(data);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al cerrar caja: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "get-current-cash-register",
  async (
    _event,
    userId: number,
  ): Promise<RESPONSE<CashRegisterDTO | null>> => {
    try {
      return await getCurrentCashRegister(userId);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al consultar caja: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "get-cash-movements",
  async (
    _event,
    cashRegisterId: string,
  ): Promise<RESPONSE<CashMovementDTO[]>> => {
    try {
      return await getCashMovements(cashRegisterId);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al consultar movimientos: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "create-cash-movement",
  async (
    _event,
    data: CreateCashMovementDTO,
  ): Promise<RESPONSE<CashMovementDTO>> => {
    try {
      return await createCashMovement(data);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al crear movimiento: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "get-type-movements",
  async (): Promise<RESPONSE<TypeMovementDTO[]>> => {
    try {
      return await getTypeMovements();
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al consultar tipos de movimiento: " + getErrorMessage(error),
      );
    }
  },
);

ipcMain.handle(
  "get-cash-summary",
  async (
    _event,
    cashRegisterId: string,
  ): Promise<RESPONSE<CashSummaryDTO>> => {
    try {
      return await getCashSummary(cashRegisterId);
    } catch (error) {
      return NEW_RESPONSE(
        -1,
        "Error inesperado al consultar resumen: " + getErrorMessage(error),
      );
    }
  },
);
