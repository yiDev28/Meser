import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { OrderItemDTO } from "@/interfaces/order";
import { RiSubtractLine, RiAddLine } from "react-icons/ri";
import { ImCancelCircle } from "react-icons/im";
import { useOrderSale } from "../hooks/useOrderSale";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { useInvoiceOrder } from "../hooks/useInvoiceOrder";
import { FaCashRegister, FaExclamationTriangle } from "react-icons/fa";

interface ModalInvoiceOrderProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: {
    orderId: string;
    items: { id: string; quantity: number }[];
    tip: number;
    paymentMethod: string;
  }) => void;
}

export function ModalInvoiceOrder({
  isOpen,
  onClose,
}: ModalInvoiceOrderProps) {
  const { updateItemQuantity, handlerCancelItemOrder, selectedOrder } =
    useOrderSale();
  const { invoiceOrder } = useInvoiceOrder();

  const [tip, setTip] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("EFECTIVO");
  const [cashStatus, setCashStatus] = useState<{
    isOpen: boolean;
    currentAmount?: number;
  } | null>(null);
  const [loadingCash, setLoadingCash] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadCashStatus();
    }
  }, [isOpen]);

  const loadCashStatus = async () => {
    setLoadingCash(true);
    try {
      const response = await window.electron.getCurrentCashRegister(999);
      if (response.code === 0 && response.data) {
        setCashStatus({
          isOpen: true,
          currentAmount: response.data.currentAmount,
        });
      } else {
        setCashStatus({ isOpen: false });
      }
    } catch {
      setCashStatus({ isOpen: false });
    } finally {
      setLoadingCash(false);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      const subtotal = selectedOrder.totalV;
      setTip(Math.round(subtotal * 0.05));
    }
  }, [selectedOrder]);

  if (!isOpen || !selectedOrder) return null;

  const subtotal = selectedOrder.totalV;
  const total = subtotal + tip;

  const handleConfirm = () => {
    invoiceOrder({
      orderId: selectedOrder.id,
      paymentMethod: 1,
      userId: 999,
      charges: [],
      discounts: 0,
      electronicInvoice: false,
    });
  };

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
          <h2 className="text-xl font-semibold">
            Facturar Orden #{selectedOrder.localNumber}
          </h2>
        </div>

        {/* Estado de caja */}
        {loadingCash ? (
          <div className="mb-4 p-3 bg-gray-100 rounded flex items-center gap-2">
            <span className="animate-pulse">Verificando caja...</span>
          </div>
        ) : cashStatus && !cashStatus.isOpen ? (
          <div className="mb-4 p-3 bg-warning-light border border-warning rounded flex items-start gap-3">
            <FaExclamationTriangle className="text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Caja cerrada</p>
              <p className="text-sm text-neutral-gray">
                No hay caja abierta. Debe{" "}
                <a href="#/cash-flow" className="underline">
                  abrir una caja
                </a>{" "}
                para registrar ventas.
              </p>
            </div>
          </div>
        ) : cashStatus && cashStatus.isOpen ? (
          <div className="mb-4 p-3 bg-success-light rounded flex items-center gap-3">
            <FaCashRegister className="text-success" />
            <div>
              <p className="font-medium text-success">Caja abierta</p>
              <p className="text-sm text-neutral-gray">
                Monto actual: {formatCurrency(cashStatus.currentAmount || 0)}
              </p>
            </div>
          </div>
        ) : null}

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
        <ul className="divide-y max-h-80 overflow-y-auto">
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
                <p className="text-xs italic text-gray-500">
                  {item.itemStatus.name}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Botones cantidad */}
                <button
                  onClick={() =>
                    updateItemQuantity(
                      selectedOrder.id,
                      item.id,
                      item.quantity - 1,
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
                      item.quantity + 1,
                    )
                  }
                  className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                >
                  <RiAddLine />
                </button>

                {/* Cancelar item */}
                <button
                  onClick={() =>
                    handlerCancelItemOrder(selectedOrder.id, item.id)
                  }
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Cancelar este plato"
                >
                  <ImCancelCircle />
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* Totales */}
        <div className="mt-6 space-y-3 text-right">
          <p className="text-sm">
            Subtotal:{" "}
            <span className="font-semibold">{formatCurrency(subtotal)}</span>
          </p>

          <div className="flex justify-end items-center gap-2">
            <label className="text-sm">Propina:</label>
            <input
              type="number"
              value={tip}
              onChange={(e) => setTip(Number(e.target.value) || 0)}
              className="w-24 border rounded px-2 py-1 text-right"
            />
          </div>

          <p className="text-lg font-bold">Total: {formatCurrency(total)}</p>
        </div>

        {/* Tipo de pago */}
        <div className="mt-6">
          <label className="block mb-1 font-medium">Método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TRANSFERENCIA">Transferencia</option>
            <option value="TARJETA">Tarjeta</option>
          </select>
        </div>

        {/* Botón confirmar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Confirmar Factura
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
