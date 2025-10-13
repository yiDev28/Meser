import { useEffect } from "react";
import { createPortal } from "react-dom";
import {  OrderItemDTO } from "@/interfaces/order";
import { ImCancelCircle } from "react-icons/im";
import { RiSubtractLine, RiAddLine } from "react-icons/ri";
import { useOrderEdit } from "../hooks/useOrderEdit";
import { formatCurrency } from "@/renderer/utils/formatPrice";

interface ModalOrderEditProps {
  isOpen: boolean;
  onClose: () => void;
  //order: OrderDTO | null;
}

export function ModalOrderEdit({ isOpen, onClose }: ModalOrderEditProps) {
  const { updateItemQuantity, cancelItemOrder, cancelOrder, selectedOrder } =
    useOrderEdit();

  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!isOpen || !selectedOrder) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 relative">
        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Cabecera */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Orden #{selectedOrder.localNumber}</h2>
          <button
            onClick={() => cancelOrder(selectedOrder.id)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            <ImCancelCircle /> Cancelar Orden
          </button>
        </div>

        {/* Datos cliente */}
        <div className="space-y-1 text-sm mb-4">
          <p>
            <span className="font-semibold">Cliente:</span>{" "}
            {selectedOrder.guestCustomer?.name}
          </p>
          <p>
            <span className="font-semibold">Teléfono:</span>{" "}
            {selectedOrder.guestCustomer?.phone}
          </p>
          <p>
            <span className="font-semibold">Dirección:</span>{" "}
            {selectedOrder.guestCustomer?.address}
          </p>
        </div>

        {/* Items */}
        <h3 className="font-semibold mb-2">productos</h3>
        <ul className="divide-y max-h-120 overflow-y-auto">
          {selectedOrder.items.map((item: OrderItemDTO) => (
            <li
              key={item.id}
              className="flex items-center justify-between py-2"
            >
              <div>
                <span className="font-medium">
                  {item.menuItem.product.name}
                </span>
                <p className="text-xs text-gray-600">{item.notes}</p>
                {item.itemStatus.name}
              </div>

              <div className="flex items-center gap-2">
                {/* Botones cantidad */}
                <button
                  onClick={() =>
                    updateItemQuantity(
                      selectedOrder.id,
                      item.id,
                      item.quantity - 1
                    )
                  }
                  disabled={item.quantity <= 1}
                  className="p-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
                >
                  <RiSubtractLine />
                </button>
                <span className="min-w-[2ch] text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItemQuantity(
                      selectedOrder.id,
                      item.id,
                      item.quantity + 1
                    )
                  }
                  className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  <RiAddLine />
                </button>

                {/* Cancelar item */}
                <button
                  onClick={() => cancelItemOrder(selectedOrder.id, item.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Cancelar este plato"
                >
                  <ImCancelCircle />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Total */}
        <p className="font-bold text-lg mt-4 text-right">
          Total: {formatCurrency(selectedOrder.totalV)}
        </p>
      </div>
    </div>,
    document.body
  );
}
