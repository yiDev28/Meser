import { useState } from "react";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbCashPlus } from "react-icons/tb";

interface ModalOpenCashProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => Promise<boolean>;
  isLoading: boolean;
}

export function ModalOpenCash({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: ModalOpenCashProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 0) {
      setError("Ingrese un monto válido");
      return;
    }

    const success = await onSubmit(numAmount);
    if (success) {
      setAmount("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-dark/50 flex items-center justify-center z-50">
      <div className="bg-neutral-light rounded-lg shadow-lg w-full max-w-lg p-8 animate-scaleIn">
        <h2 className="text-xl font-bold text-neutral-dark mb-4">Abrir Caja</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 px-4 ">
            <InputGeneric
              label="Monto Inicial"
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              icon={MdOutlineAttachMoney}
              error={error}
              size="xl"
            />
          </div>

          <div className="flex gap-3 justify-between">
            <ButtonActionsPadding
              type="button"
              label="Cancelar"
              mode="info"
              onClick={onClose}
              disabled={isLoading}
              size="xl"
            />
            <ButtonActionsPadding
              type="submit"
              label={isLoading ? "Abriendo..." : "Abrir Caja"}
              mode="primary"
              disabled={isLoading || !amount}
              icon={TbCashPlus}
              iconPosition="right"
              size="xl"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
