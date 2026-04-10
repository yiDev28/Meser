import { useState } from "react";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { TexTareaGeneric } from "@/renderer/components/Inputs/TexTareaGeneric";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbCashOff } from "react-icons/tb";

interface ModalCloseCashProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (finalAmount: number, observations?: string) => Promise<boolean>;
  currentAmount: number;
  isLoading: boolean;
}

export function ModalCloseCash({
  isOpen,
  onClose,
  onSubmit,
  currentAmount,
  isLoading,
}: ModalCloseCashProps) {
  const [finalAmount, setFinalAmount] = useState(currentAmount.toString());
  const [observations, setObservations] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(finalAmount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Ingrese un monto válido");
      return;
    }

    const success = await onSubmit(numAmount, observations.trim() || undefined);
    if (success) {
      setFinalAmount("");
      setObservations("");
      onClose();
    }
  };

  const difference = parseFloat(finalAmount) - currentAmount;

  return (
    <div className="fixed inset-0 bg-neutral-dark/50 flex items-center justify-center z-50">
      <div className="bg-neutral-light  rounded-lg shadow-lg w-full max-w-lg p-8 animate-scaleIn">
        <h2 className="text-xl font-bold text-neutral-dark mb-4">
          Cerrar Caja
        </h2>

        <div className="bg-background  p-4 rounded-lg mb-4 border border-neutral-gray/50">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-gray font-semibold">
              Monto en Caja:
            </span>
            <span className="font-semibold text-neutral-dark ">
              {formatCurrency(currentAmount)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-neutral-gray font-semibold">Diferencia:</span>
            <span
              className={`font-semibold ${
                difference >= 0 ? "text-success" : "text-error"
              }`}
            >
              {difference >= 0 ? "+" : ""}
              {formatCurrency(difference)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-4">
            <InputGeneric
              label="Monto Final en Caja"
              type="number"
              placeholder="0"
              value={finalAmount}
              onChange={(e) => setFinalAmount(e.target.value)}
              error={error}
              icon={MdOutlineAttachMoney}
              size="xl"
            />
          </div>

          <div className="mb-4 px-4">
            <TexTareaGeneric
              label="Observaciones (opcional)"
              placeholder="Observaciones del cierre de caja..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              size="lg"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <ButtonActionsPadding
              type="button"
              label="Cancelar"
              mode="info"
              onClick={onClose}
              disabled={isLoading}
            />
            <ButtonActionsPadding
              type="submit"
              label={isLoading ? "Cerrando..." : "Cerrar Caja"}
              mode="primary"
              disabled={isLoading}
              icon={TbCashOff}
              iconPosition="right"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
