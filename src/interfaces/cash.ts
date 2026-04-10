export interface CashRegisterDTO {
  id: string;
  openedAt: string;
  closedAt?: string;
  initialAmount: number;
  currentAmount: number;
  isOpen: boolean;
  userId: number;
  userName?: string;
  status: number;
}

export interface CashMovementDTO {
  id: string;
  cashRegisterId: string;
  typeMovement: TypeMovementDTO;
  description?: string;
  amount: number;
  balance: number;
  userId: number;
  userName?: string;
  createdAt: string;
}

export interface TypeMovementDTO {
  id: number;
  description: string;
  affectsCash: boolean;
  affectsMode: number;
}

export interface OpenCashRegisterDTO {
  initialAmount: number;
  userId: number;
}

export interface CreateCashMovementDTO {
  cashRegisterId: string;
  typeMovementId: number;
  amount: number;
  description?: string;
  userId: number;
}

export interface CloseCashRegisterDTO {
  cashRegisterId: string;
  finalAmount: number;
  observations?: string;
  userId: number;
}

export interface CashSummaryDTO {
  initialAmount: number;
  totalIn: number;
  totalOut: number;
  salesTotal: number;
  otherInTotal: number;
  currentAmount: number;
  difference: number;
  movementsCount: number;
}

export const CASH_MOVEMENT_MODE = {
  ENTRY: 1,
  EXIT: -1,
  NEUTRAL: 0,
} as const;

export type CashMovementMode = typeof CASH_MOVEMENT_MODE[keyof typeof CASH_MOVEMENT_MODE];
