import { useState } from "react";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { TexTareaGeneric } from "@/renderer/components/Inputs/TexTareaGeneric";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { TypeMovementDTO } from "@/interfaces/cash";
import { CASH_MOVEMENT_MODE } from "@/interfaces/cash";
import { CardGeneric } from "@/renderer/components/Cards/CardGeneric";
import { MdOutlineAttachMoney } from "react-icons/md";
import { TbCashBanknotePlus } from "react-icons/tb";

interface ModalNewMovementProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    typeId: number,
    amount: number,
    description?: string,
  ) => Promise<boolean>;
  typeMovements: TypeMovementDTO[];
  isLoading: boolean;
}

export function ModalNewMovement({
  isOpen,
  onClose,
  onSubmit,
  typeMovements,
  isLoading,
}: ModalNewMovementProps) {
  const [typeId, setTypeId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ type?: string; amount?: string }>({});

  if (!isOpen) return null;

  const entriesMovements = typeMovements.filter(
    (t) => t.affectsMode === CASH_MOVEMENT_MODE.ENTRY,
  );
  const exitMovements = typeMovements.filter(
    (t) => t.affectsMode === CASH_MOVEMENT_MODE.EXIT,
  );
  const otherMovements = typeMovements.filter(
    (t) =>
      t.affectsMode !== CASH_MOVEMENT_MODE.ENTRY &&
      t.affectsMode !== CASH_MOVEMENT_MODE.EXIT,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: { type?: string; amount?: string } = {};

    if (!typeId) {
      newErrors.type = "Seleccione un tipo de movimiento";
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = "Ingrese un monto válido mayor a 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const success = await onSubmit(
      typeId as number,
      numAmount,
      description.trim() || undefined,
    );
    if (success) {
      setTypeId("");
      setAmount("");
      setDescription("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-neutral-dark/50 flex items-center justify-center z-50">
      <div className="bg-neutral-light  rounded-lg shadow-lg w-full max-w-lg p-8 animate-scaleIn">
        <h2 className="text-xl font-bold text-neutral-dark  mb-4">
          Nuevo Movimiento
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold text-neutral-dark/80 ">
              Tipo de Movimiento
            </label>

            {entriesMovements.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-neutral-gray mb-2">Entradas</p>
                <div className="grid grid-cols-2 gap-2">
                  {entriesMovements.map((type) => (
                    <CardGeneric
                      key={type.id}
                      title={type.description}
                      size="sm"
                      mode="success"
                      isSelected={typeId === type.id}
                      onClick={() => setTypeId(type.id)}
                      alignItems="center"
                    />
                  ))}
                </div>
              </div>
            )}

            {exitMovements.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-neutral-gray mb-2">Salidas</p>
                <div className="grid grid-cols-2 gap-2">
                  {exitMovements.map((type) => (
                    <CardGeneric
                      key={type.id}
                      title={type.description}
                      size="sm"
                      mode="danger"
                      isSelected={typeId === type.id}
                      onClick={() => setTypeId(type.id)}
                      alignItems="center"
                    />
                  ))}
                </div>
              </div>
            )}

            {entriesMovements.length === 0 && exitMovements.length === 0 && (
              <div className="mb-3">
                <p className="text-xs text-neutral-gray mb-2">Todos</p>
                <div className="grid grid-cols-2 gap-2">
                  {typeMovements.map((type) => (
                    <CardGeneric
                      key={type.id}
                      title={type.description}
                      size="sm"
                      mode="info"
                      isSelected={typeId === type.id}
                      onClick={() => setTypeId(type.id)}
                      alignItems="center"
                    />
                  ))}
                </div>
              </div>
            )}

            {otherMovements.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-neutral-gray mb-2">Otros</p>
                <div className="grid grid-cols-2 gap-2">
                  {otherMovements.map((type) => (
                    <CardGeneric
                      key={type.id}
                      title={type.description}
                      size="sm"
                      mode="warning"
                      isSelected={typeId === type.id}
                      onClick={() => setTypeId(type.id)}
                      alignItems="center"
                    />
                  ))}
                </div>
              </div>
            )}

            {errors.type && (
              <p className="mt-1 text-xs text-error">{errors.type}</p>
            )}
          </div>

          <div className="mb-4 px-4">
            <InputGeneric
              label="Monto"
              type="number"
              placeholder="0"
              value={amount}
              icon={MdOutlineAttachMoney}
              onChange={(e) => setAmount(e.target.value)}
              error={errors.amount}
              size="lg"
            />
          </div>

          <div className="mb-4 px-4">
            <TexTareaGeneric
              label="Descripción (opcional)"
              placeholder="Descripción del movimiento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              size="lg"
            />
          </div>

          <div className="flex gap-3 justify-between">
            <ButtonActionsPadding
              type="button"
              label="Cancelar"
              mode="info"
              onClick={onClose}
              disabled={isLoading}
            />
            <ButtonActionsPadding
              type="submit"
              label={isLoading ? "Guardando..." : "Guardar"}
              mode="primary"
              disabled={isLoading || !typeId || !amount}
              icon={TbCashBanknotePlus}
              iconPosition="right"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
