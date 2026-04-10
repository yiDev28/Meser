import { CashMovementDTO } from "@/interfaces/cash";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { CASH_MOVEMENT_MODE } from "@/interfaces/cash";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { MdOutlineDoNotDisturbAlt } from "react-icons/md";

interface CardMovementProps {
  movement: CashMovementDTO;
}

export function CardMovement({ movement }: CardMovementProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("es-CO", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const isEntry =
    movement.typeMovement?.affectsMode === CASH_MOVEMENT_MODE.ENTRY;
  const isExit = movement.typeMovement?.affectsMode === CASH_MOVEMENT_MODE.EXIT;

  return (
    <div className="bg-neutral-light rounded-lg p-4 border border-neutral-light mb-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isEntry
                ? "bg-success/20 text-success"
                : isExit
                  ? "bg-error/20 text-error"
                  : "bg-info/20 text-info"
            }`}
          >
            {isEntry ? (
              <FaArrowUp className="w-5 h-5" />
            ) : isExit ? (
              <FaArrowDown className="w-5 h-5" />
            ) : (
              <MdOutlineDoNotDisturbAlt className="w-5 h-5" />
            )}
          </div>
          <div>
            <p className="font-medium text-neutral-dark">
              {movement.typeMovement?.description || "Movimiento"}
            </p>
            <p className="text-xs text-neutral-gray">
              {formatDate(movement.createdAt)}
              {movement.userName && ` • ${movement.userName}`}
            </p>
            {movement.description && (
              <p className="text-xs text-neutral-gray mt-1">
                {movement.description}
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p
            className={`font-bold ${
              isEntry
                ? "text-success"
                : isExit
                  ? "text-error"
                  : "text-neutral-dark"
            }`}
          >
            {isEntry ? "+" : isExit ? "-" : ""}
            {formatCurrency(movement.amount)}
          </p>
          <p className="text-xs text-neutral-gray">
            Saldo: {formatCurrency(movement.balance)}
          </p>
        </div>
      </div>
    </div>
  );
}
