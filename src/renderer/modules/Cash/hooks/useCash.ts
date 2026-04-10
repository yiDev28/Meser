import { useState, useCallback } from "react";
import { useCashContext } from "../context/CashContext";
import { getErrorMessage } from "@/utils/errorUtils";
import { CashMovementDTO } from "@/interfaces/cash";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";

export function useCash() {
  const {
    cashRegister,
    setCashRegister,
    movements,
    setMovements,
    typeMovements,
    summary,
    setSummary,
    isLoading,
    alert,
    setAlert,
    refreshCash,
    filter,
    setFilter,
  } = useCashContext();

  const [isOpening, setIsOpening] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isCreatingMovement, setIsCreatingMovement] = useState(false);

  const openCash = useCallback(
    async (initialAmount: number) => {
      setIsOpening(true);
      try {
        const userId = 999;

        const response = await window.electron.openCashRegister({
          initialAmount,
          userId,
        });
        console.log("openCashRegister response:", response);

        if (response.code === 0) {
          await refreshCash();
          defaultAlert({ mode: "success", body: "Caja abierta exitosamente" ,successButton: true,});
          return true;
        } else {
          defaultAlert({ mode: "warning", body: response.msg ,successButton: true,});

          return false;
        }
      } catch (error) {
        defaultAlert({ mode: "error", body: "Error al abrir caja: " + getErrorMessage(error) ,successButton: true,});
        return false;
      } finally {
        setIsOpening(false);
      }
    },
    [setAlert, refreshCash],
  );

  const closeCash = useCallback(
    async (finalAmount: number, observations?: string) => {
      setIsClosing(true);
      try {
        const userId = 999;
        if (!cashRegister) {
          defaultAlert({ mode: "error", body: "Caja no encontrada" ,successButton: true,});
          return false;
        }

        const response = await window.electron.closeCashRegister({
          cashRegisterId: cashRegister.id,
          finalAmount,
          observations,
          userId,
        });

        if (response.code === 0) {
          setCashRegister(null);
          setMovements([]);
          setSummary(null);
          defaultAlert({ mode: "success", body: "Caja cerrada exitosamente" ,successButton: true,});
          return true;
        } else {
          defaultAlert({ mode: "warning", body: response.msg ,successButton: true,});
          return false;
        }
      } catch (error) {
        defaultAlert({ mode: "error", body: "Error al cerrar caja: " + getErrorMessage(error) ,successButton: true,});
        return false;
      } finally {
        setIsClosing(false);
      }
    },
    [cashRegister, setCashRegister, setMovements, setSummary, setAlert],
  );

  const createMovement = useCallback(
    async (typeId: number, amount: number, description?: string) => {
      setIsCreatingMovement(true);
      try {
        const userId = 999;
        if (!cashRegister) {
          defaultAlert({ mode: "error", body: "Caja no encontrada" ,successButton: true,});
          return false;
        }

        const response = await window.electron.createCashMovement({
          cashRegisterId: cashRegister.id,
          typeMovementId: typeId,
          amount,
          description,
          userId,
        });

        if (response.code === 0) {
          setMovements([response.data as CashMovementDTO, ...movements]);
          await refreshCash();
          defaultAlert({ mode: "success", body: "Movimiento registrado" ,successButton: true,});
          return true;
        } else {
          defaultAlert({ mode: "warning", body: response.msg ,successButton: true,});
          return false;
        }
      } catch (error) {
        defaultAlert({ mode: "error", body: "Error al crear movimiento: " + getErrorMessage(error) ,successButton: true,});
        return false;
      } finally {
        setIsCreatingMovement(false);
      }
    },
    [cashRegister, setMovements, setAlert, refreshCash],
  );

  return {
    cashRegister,
    movements,
    typeMovements,
    summary,
    isLoading,
    isOpening,
    isClosing,
    isCreatingMovement,
    alert,
    openCash,
    closeCash,
    createMovement,
    refreshCash,
    filter,
    setFilter,
  };
}
