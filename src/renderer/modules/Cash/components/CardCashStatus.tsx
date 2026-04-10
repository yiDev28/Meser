import { formatCurrency } from "@/renderer/utils/formatPrice";
import { CashRegisterDTO } from "@/interfaces/cash";
import { FaCashRegister } from "react-icons/fa6";
import {
  TbCashBanknoteOff,
  TbCashMove,
  TbCashPlus,
  TbCashRegister,
} from "react-icons/tb";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";

interface CardCashStatusProps {
  cashRegister: CashRegisterDTO;
  onOpenCash: () => void;
  onCloseCash: () => void;
  onNewMovement: () => void;
}

export function CardCashStatus({
  cashRegister,
  onOpenCash,
  onCloseCash,
  onNewMovement,
}: CardCashStatusProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-CO", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="bg-neutral-light  rounded-lg shadow-lg p-3 px-6 ">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          {cashRegister.isOpen ? (
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center">
              <FaCashRegister className="w-6 h-6 text-success" />
            </div>
          ) : (
            <div className="w-12 h-12 bg-neutral-gray/20 rounded-full flex items-center justify-center">
              <TbCashRegister className="w-6 h-6 text-neutral-gray" />
            </div>
          )}
          <div>
            <h2 className="text-xl font-bold text-neutral-dark ">
              {cashRegister.isOpen ? "Caja Abierta" : "Caja Cerrada"}
            </h2>
            <p className="text-sm text-neutral-gray">
              {cashRegister.isOpen
                ? `Abierta el ${formatDate(cashRegister.openedAt)}`
                : ``}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm text-neutral-gray">Monto Actual</p>
          <p className="text-2xl font-bold text-primary ">
            {formatCurrency(cashRegister.currentAmount)}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        {cashRegister.isOpen ? (
          <div className="flex items-center gap-3">
            <ButtonActionsPadding
              onClick={onCloseCash}
              label="Cerrar Caja"
              icon={TbCashBanknoteOff}
              iconPosition="right"
              mode="danger"
            />
            <ButtonActionsPadding
              onClick={onNewMovement}
              label="Movimiento"
              icon={TbCashMove}
              iconPosition="right"
              mode="success"
            />
          </div>
        ) : (
          <ButtonActionsPadding
            onClick={onOpenCash}
            label="Abrir Caja"
            icon={TbCashPlus}
            iconPosition="right"
            mode="primary"
          />
        )}
      </div>
    </div>
  );
}
