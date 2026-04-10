import {
  CashSummaryDTO,
  TypeMovementDTO,
  CASH_MOVEMENT_MODE,
} from "@/interfaces/cash";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";

import { CardGeneric } from "@/renderer/components/Cards/CardGeneric";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { FaArrowUp, FaArrowDown, FaMoneyBillWave } from "react-icons/fa6";
import { MdCleaningServices } from "react-icons/md";
import { PiCashRegisterLight } from "react-icons/pi";

interface CashSummaryProps {
  summary: CashSummaryDTO;
  typeMovements: TypeMovementDTO[];
  filter: number | null;
  onFilterChange: (typeId: number | null) => void;
}

export function CashSummary({
  summary,
  typeMovements,
  filter,
  onFilterChange,
}: CashSummaryProps) {
  const difference = summary.currentAmount - summary.initialAmount;

  const filteredByType = typeMovements;

  return (
    <div className="bg-neutral-light rounded-lg shadow-lg p-3 px-6 space-y-3">
      <div className="flex justify-between items-center ">
        <h3 className="text-lg font-bold text-neutral-dark">
          Resumen del Arqueo
        </h3>
        {filter && (
          <ButtonActions
            icon={MdCleaningServices}
            onClick={() => onFilterChange(null)}
            size="sm"
            mode="primary_light"
            label="Limpiar filtro"
          />
        )}
      </div>

      <div className="border border-neutral-gray/50 p-3 rounded-lg bg-background">
        <p className="text-sm font-semibold text-neutral-gray mb-2">
          Filtrar por tipo:
        </p>
        <div className="flex flex-wrap gap-2">
          <ButtonActionsPadding
            label="Todos"
            mode="primary"
            size="sm"
            onClick={() => onFilterChange(null)}
            disabled={filter === null}
          />
          {filteredByType.map((tm) => {
            const isEntry = tm.affectsMode === CASH_MOVEMENT_MODE.ENTRY;
            const isExit = tm.affectsMode === CASH_MOVEMENT_MODE.EXIT;
            return (
              <ButtonActionsPadding
                key={tm.id}
                onClick={() => onFilterChange(tm.id)}
                label={tm.description}
                size="sm"
                mode={
                  filter === tm.id
                    ? isEntry
                      ? "success"
                      : isExit
                        ? "danger"
                        : "info"
                    : "primary_light"
                }
              />
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <CardGeneric
          title={
            <div className="flex items-center gap-2 mb-2">
              <FaMoneyBillWave className="w-5 h-5 text-secondary" />
              <span className="text-sm ">Monto Inicial</span>
            </div>
          }
          body={formatCurrency(summary.initialAmount)}
          size="sm"
          mode="secondary"
        />

        <CardGeneric
          title={
            <div className="flex items-center gap-2 mb-2">
              <PiCashRegisterLight className="w-5 h-5 text-info" />
              <span className="text-sm ">Monto Actual</span>
            </div>
          }
          body={formatCurrency(summary.currentAmount)}
          size="sm"
          mode="info"
        />

        <CardGeneric
          title={
            <div className="flex items-center gap-2 mb-2">
              <FaArrowUp className="w-5 h-5 text-success" />
              <span className="text-sm ">Total Entradas</span>
            </div>
          }
          body={`+ ${formatCurrency(summary.totalIn)}`}
          size="sm"
          mode="success"
        />

        <CardGeneric
          title={
            <div className="flex items-center gap-2 mb-2">
              <FaArrowDown className="w-5 h-5 text-danger" />
              <span className="text-sm ">Total Salidas</span>
            </div>
          }
          body={`- ${formatCurrency(summary.totalOut)}`}
          size="sm"
          mode="danger"
        />
      </div>

      <div className="border-t border-neutral-light">
        <div className="flex justify-between items-center">
          <span className="text-sm text-neutral-gray font-semibold">
            Diferencia (Actual - Inicial)
          </span>
          <span
            className={`text-lg font-bold ${
              difference >= 0 ? "text-success" : "text-error"
            }`}
          >
            {difference >= 0 ? "+" : ""}
            {formatCurrency(difference)}
          </span>
        </div>
        <div className="flex justify-between items-center ">
          <span className="text-sm text-neutral-gray font-semibold">
            Total de Movimientos
          </span>
          <span className="text-lg font-medium text-neutral-dark">
            {summary.movementsCount}
          </span>
        </div>
      </div>
    </div>
  );
}
