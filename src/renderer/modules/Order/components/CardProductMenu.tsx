import { MenuItemDTO } from "@/interfaces/order";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { TexTareaGeneric } from "@/renderer/components/Inputs/TexTareaGeneric";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { useState } from "react";
import { MdAdd, MdRemove } from "react-icons/md";

interface MenuProductCardProps {
  item: MenuItemDTO;
  quantity: number;
  notes?: string;
  onAdd: () => void;
  onRemove: () => void;
  onChangeNotes: (value: string) => void;
}

export const CardProductMenu: React.FC<MenuProductCardProps> = ({
  item,
  quantity,
  notes,
  onAdd,
  onRemove,
  onChangeNotes,
}) => {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="bg-neutral-light rounded-lg shadow-lg border border-neutral-gray/30 p-2 flex gap-4 animate-scaleIn">
      {/* Imagen */}
      <div className="w-28 h-28 shrink-0 rounded-lg overflow-hidden bg-background">
        {(item.product.imagePath || item.product.urlImage) ? (
          <img
            src={item.product.imagePath || item.product.urlImage}
            alt={item.product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/electron-vite.animate.svg";
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs text-neutral-gray">
            Sin imagen
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h4 className="font-bold text-xl text-primary">
            {item.product.name}
          </h4>
          <p className="text-sm text-neutral-dark/80">
            {item.product.description}
          </p>
          <p className="mt-1 font-bold text-lg">{formatCurrency(item.price)}</p>
        </div>

        {/* Acciones */}
        <div className="flex items-center justify-between mt-3">
          {/* Notas */}
          <ButtonActionsPadding
            onClick={() => setShowNotes((s) => !s)}
            label={showNotes ? "Ocultar nota" : "Agregar nota"}
            size="sm"
          />
          {/* Cantidad */}
          <div className="flex items-center gap-3">
            <ButtonActions icon={MdRemove} onClick={onRemove} mode="danger" />

            <span className="min-w-5 text-center font-semibold">
              {quantity}
            </span>

            <ButtonActions icon={MdAdd} onClick={onAdd} mode="success" />
          </div>
        </div>

        {showNotes && (
          <div className="mt-2">
            <TexTareaGeneric
              name="notes"
              placeholder="Ej: sin cebolla, término medio..."
              value={notes}
              onChange={(e) => onChangeNotes(e.target.value)}
              size="sm"
            />
          </div>
        )}
      </div>
    </div>
  );
};
