import { ChildrenProps } from "@/interfaces/app";
import {
  CashRegisterDTO,
  CashMovementDTO,
  TypeMovementDTO,
  CashSummaryDTO,
} from "@/interfaces/cash";
import { createContext, useContext, useState, useCallback } from "react";
import { getErrorMessage } from "@/utils/errorUtils";

interface CashContextProps {
  cashRegister: CashRegisterDTO | null;
  setCashRegister: (cash: CashRegisterDTO | null) => void;
  movements: CashMovementDTO[];
  setMovements: (movements: CashMovementDTO[]) => void;
  typeMovements: TypeMovementDTO[];
  setTypeMovements: (types: TypeMovementDTO[]) => void;
  summary: CashSummaryDTO | null;
  setSummary: (summary: CashSummaryDTO | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  alert: { type: string; msg: string } | null;
  setAlert: (alert: { type: string; msg: string } | null) => void;
  refreshCash: () => Promise<void>;
  filter: number | null;
  setFilter: (filter: number | null) => void;
}

const CashContext = createContext<CashContextProps | undefined>(undefined);

export const CashProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [cashRegister, setCashRegister] = useState<CashRegisterDTO | null>(null);
  const [movements, setMovements] = useState<CashMovementDTO[]>([]);
  const [typeMovements, setTypeMovements] = useState<TypeMovementDTO[]>([]);
  const [summary, setSummary] = useState<CashSummaryDTO | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);
  const [filter, setFilter] = useState<number | null>(null);

  const refreshCash = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const userId = 999;

      const [cashResponse, typesRes] = await Promise.all([
        window.electron.getCurrentCashRegister(userId),
        window.electron.getTypeMovements(),
      ]);

      if (typesRes.code === 0) {
        setTypeMovements(typesRes.data || []);
      }

      if (cashResponse.code === 0) {
        setCashRegister(cashResponse.data);
        if (cashResponse.data) {
          const [movementsRes, summaryRes] = await Promise.all([
            window.electron.getCashMovements(cashResponse.data.id),
            window.electron.getCashSummary(cashResponse.data.id),
          ]);

          if (movementsRes.code === 0) {
            setMovements(movementsRes.data || []);
          }
          if (summaryRes.code === 0) {
            setSummary(summaryRes.data);
          }
        } else {
          setMovements([]);
          setSummary(null);
        }
      } else {
        console.log("No hay caja abierta, código:", cashResponse.code);
        setCashRegister(null);
        setMovements([]);
        setSummary(null);
      }
    } catch (error) {
      console.error("Error refreshing cash:", error);
      setAlert({
        type: "ERROR",
        msg: "Error al cargar caja: " + getErrorMessage(error),
      });
      setCashRegister(null);
      setMovements([]);
      setSummary(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: CashContextProps = {
    cashRegister,
    setCashRegister,
    movements,
    setMovements,
    typeMovements,
    setTypeMovements,
    summary,
    setSummary,
    isLoading,
    setIsLoading,
    alert,
    setAlert,
    refreshCash,
    filter,
    setFilter,
  };

  return <CashContext.Provider value={value}>{children}</CashContext.Provider>;
};

export const useCashContext = (): CashContextProps => {
  const context = useContext(CashContext);
  if (!context) {
    throw new Error("useCashContext debe ser usado dentro de CashProvider");
  }
  return context;
};
