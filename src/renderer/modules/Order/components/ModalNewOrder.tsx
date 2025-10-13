import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CreateOrderDTO } from "@/interfaces/order";
import { useParamOrder } from "@/renderer/context/ParamOrderContext";
import { useNewOrder } from "../hooks/useNewOrder";

interface ModalNewOrderProps {
  userId?: number; // el usuario que crea la orden
  onClose: () => void;
  isOpen: boolean;
}

export const ModalNewOrder: React.FC<ModalNewOrderProps> = ({
  userId = 999,
  isOpen,
  onClose,
}) => {
  const { orderType, menu } = useParamOrder();
  const { createOrder } = useNewOrder();

  const [step, setStep] = useState<number>(1);

  const [payload, setPayload] = useState<CreateOrderDTO>({
    customerId: 0,
    orderType: 0,
    userId: userId,
    items: [],
  });

  // Campos temporales
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tableId, setTableId] = useState<number | undefined>(undefined);
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSelectOrderType = (typeId: number) => {
    setPayload((prev) => ({ ...prev, orderType: typeId }));
    setStep(2);
  };

  const handleContinueCustomer = () => {
    setPayload((prev) => ({
      ...prev,
      name,
      phone,
      address,
      tableId,
    }));
    setStep(3);
  };

  const handleAddItem = (menuItemId: number) => {
    setPayload((prev) => {
      const existing = prev.items.find((i) => i.menuItemId === menuItemId);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((i) =>
            i.menuItemId === menuItemId ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return {
        ...prev,
        items: [...prev.items, { menuItemId, quantity: 1 }],
      };
    });
  };

  const handleRemoveItem = (menuItemId: number) => {
    setPayload((prev) => {
      const existing = prev.items.find((i) => i.menuItemId === menuItemId);
      if (!existing) return prev;
      if (existing.quantity === 1) {
        return {
          ...prev,
          items: prev.items.filter((i) => i.menuItemId !== menuItemId),
        };
      }
      return {
        ...prev,
        items: prev.items.map((i) =>
          i.menuItemId === menuItemId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  };

  const handleNoteItem = (menuItemId: number, note: string) => {
    setPayload((prev) => ({
      ...prev,
      items: prev.items.map((i) =>
        i.menuItemId === menuItemId ? { ...i, notes: note } : i
      ),
    }));
  };

  const handleConfirm = () => {
    createOrder({ ...payload, notes });
    onClose();
  };

  const selectedType = orderType.find((t) => t.id === payload.orderType);

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative">
        <h2 className="text-xl font-bold mb-4">Nueva Orden</h2>

        {/* Paso 1: Selección de tipo */}
        {step === 1 && (
          <div>
            <h3 className="mb-4">Selecciona el tipo de orden</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {orderType.map((t) => (
                <div
                  key={t.id}
                  className="p-4 rounded-lg cursor-pointer border hover:shadow-md"
                  style={{ backgroundColor: t.colorLabel }}
                  onClick={() => handleSelectOrderType(t.id)}
                >
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm">{t.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Paso 2: Datos adicionales */}
        {step === 2 && (
          <div>
            <h3 className="mb-4">Datos adicionales</h3>
            {selectedType?.paramType === "DELIVERY" && (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  type="text"
                  placeholder="Dirección"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            {selectedType?.paramType === "ONSITE" && (
              <div className="space-y-3">
                <input
                  type="number"
                  placeholder="Número de mesa"
                  value={tableId || ""}
                  onChange={(e) => setTableId(Number(e.target.value))}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            )}

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setStep(1)}
              >
                Atrás
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleContinueCustomer}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Selección de productos */}
        {step === 3 && (
          <div>
            <h3 className="mb-4">Selecciona productos</h3>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {menu?.menuItems.map((item) => {
                const added = payload.items.find(
                  (i) => i.menuItemId === item.id
                );
                return (
                  <div key={item.id} className="flex flex-col border-b py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{item.product.name}</h4>
                        <p className="text-sm">{item.product.description}</p>
                        <p className="text-sm font-bold">${item.price}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-2 py-1 bg-red-500 text-white rounded"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          -
                        </button>
                        <span>{added?.quantity || 0}</span>
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded"
                          onClick={() => handleAddItem(item.id)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    {added && (
                      <textarea
                        placeholder="Notas para este plato"
                        value={added.notes || ""}
                        onChange={(e) =>
                          handleNoteItem(item.id, e.target.value)
                        }
                        className="mt-2 w-full border rounded px-3 py-2 text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setStep(2)}
              >
                Atrás
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={() => setStep(4)}
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* Paso 4: Resumen */}
        {step === 4 && (
          <div>
            <h3 className="mb-4">Resumen de la orden</h3>
            <table className="w-full text-sm border">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-2 text-left">Plato</th>
                  <th className="p-2">Cantidad</th>
                  <th className="p-2">Notas</th>
                </tr>
              </thead>
              <tbody>
                {payload.items.map((i) => {
                  const product = menu?.menuItems.find(
                    (m: { id: number; }) => m.id === i.menuItemId
                  );
                  return (
                    <tr key={i.menuItemId} className="border-t">
                      <td className="p-2">{product?.product.name}</td>
                      <td className="p-2 text-center">{i.quantity}</td>
                      <td className="p-2">{i.notes || "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <textarea
              placeholder="Notas generales de la orden"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-4 w-full border rounded px-3 py-2 text-sm"
            />

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                onClick={() => setStep(3)}
              >
                Atrás
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
                onClick={handleConfirm}
              >
                Confirmar orden
              </button>
            </div>
          </div>
        )}

        {/* Botón cerrar */}
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
};
