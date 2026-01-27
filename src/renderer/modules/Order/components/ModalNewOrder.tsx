import React from "react";
import { createPortal } from "react-dom";
import { useNewOrder } from "../hooks/useNewOrder";
import { GrNext } from "react-icons/gr";
import CardOrderType from "./CardOrderType";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { MdArrowBackIos, MdClose } from "react-icons/md";
import { RiStickyNoteAddLine } from "react-icons/ri";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { ButtonGeneric } from "@/renderer/components/Buttons/ButtonGeneric";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ORDER_TYPE } from "@/interfaces/const/order.const";
import CardTable from "./CardTable";
import CardCatProd from "./CardCatProd";
import { CardProductMenu } from "./CardProductMenu";
import { BiMessageSquareDetail } from "react-icons/bi";
import TableResumeNewOrder from "./TableResumeNewOrder";

interface ModalNewOrderProps {
  isOpen: boolean;
  newOrder: ReturnType<typeof useNewOrder>;
}

export const ModalNewOrder: React.FC<ModalNewOrderProps> = ({
  isOpen,
  newOrder,
}) => {
  const {
    step,
    handleSelectOrderType,
    selectedType,
    setStep,
    handleContinueCustomer,
    handleRemoveItem,
    handleAddItem,
    handleNoteItem,
    handleConfirm,
    payload,
    orderType,
    menu,
    closeModalNewOrder,
    handleChange,
    errors,
    tables,
    handleSelectTable,
    categoriesProducts,
    handleSelectCategory,
    filteredProducts,
    selectedCategoryId,
  } = newOrder;

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-neutral-dark/70 p-4 overflow-auto animate-fadeIn">
      <div
        className={`bg-background rounded-lg shadow-lg p-6 relative animate-scaleIn flex flex-col ${
          step === 3 ? "w-[98vw] h-[95vh]" : "max-h-[90vh] w-full max-w-4xl"
        } transition-all duration-300 ease-in-out`}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-primary">
            <RiStickyNoteAddLine /> Nueva Orden
          </h2>
          {/* Botón cerrar */}
          <ButtonActions
            onClick={closeModalNewOrder}
            mode="light"
            icon={MdClose}
          />
        </div>
        <div className="py-3 flex-1 overflow-hidden flex flex-col">
          {/* Paso 1: Selección de tipo */}
          {step === 1 && (
            <div>
              <h3 className="mb-4 font-semibold">
                Selecciona el tipo de orden
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
                {orderType.map((t) => {
                  return (
                    <CardOrderType
                      key={t.id}
                      orderType={t}
                      onClick={() => handleSelectOrderType(t.id)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Paso 2: Datos adicionales */}
          {step === 2 && (
            <div>
              <h3 className="mb-4 font-semibold">Datos de la orden</h3>
              <div className="space-y-3 overflow-y-auto overflow-x-hidden h-auto max-h-[60vh]">
                {selectedType?.paramType === ORDER_TYPE.DELIVERY && (
                  <>
                    <div className="animate-scaleIn">
                      <InputGeneric
                        name="name"
                        label="Nombre cliente"
                        type="text"
                        value={payload.name?.toUpperCase()}
                        onChange={handleChange}
                        error={errors.name}
                      />
                    </div>

                    <div className="animate-scaleIn">
                      <InputGeneric
                        name="phone"
                        label="Telefono de contacto"
                        type="tel"
                        value={payload.phone}
                        onChange={handleChange}
                        placeholder="3XX-XXX-XXXX o 601-XXX-XXXX"
                        error={errors.phone}
                      />
                    </div>

                    <div className="animate-scaleIn">
                      <InputGeneric
                        name="address"
                        label="Direccion de entrega"
                        type="text"
                        value={payload.address}
                        onChange={handleChange}
                        placeholder="Ejemplo: Calle 48 #15-20"
                        error={errors.address}
                      />
                    </div>
                  </>
                )}

                {selectedType?.paramType === ORDER_TYPE.CARRY && (
                  <div className="animate-scaleIn">
                    <InputGeneric
                      name="name"
                      label="Nombre cliente"
                      type="text"
                      value={payload.name?.toUpperCase()}
                      onChange={handleChange}
                      error={errors.name}
                    />
                  </div>
                )}

                {selectedType?.paramType === ORDER_TYPE.ONSITE && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 m-3">
                    {tables.map((table) => {
                      return (
                        <CardTable
                          key={table.id}
                          table={table}
                          onClick={() => handleSelectTable(table.id)}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-between ">
                <ButtonGeneric
                  label="Volver"
                  onClick={() => setStep(1)}
                  icon={IoIosArrowBack}
                />
                {selectedType?.paramType != ORDER_TYPE.ONSITE && (
                  <ButtonGeneric
                    label="Continuar"
                    onClick={handleContinueCustomer}
                    icon={IoIosArrowForward}
                    iconPosition="right"
                    mode="primary"
                  />
                )}
              </div>
            </div>
          )}

          {/* Paso 3: Selección de productos */}
          {step === 3 && (
            <div className="flex flex-col h-full overflow-hidden">
              <div className="grid grid-cols-12  gap-4 h-full">
                <div className="col-span-2 col-start-1 h-full overflow-y-auto overflow-x-hidden p-2 bg-primary rounded-lg">
                  <div className="space-y-2 ">
                    {categoriesProducts.map((cat) => {
                      return (
                        <CardCatProd
                          key={cat.id}
                          category={cat}
                          onClick={() => handleSelectCategory(cat.id)}
                          isSelected={cat.id === selectedCategoryId}
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-5 h-full overflow-y-auto overflow-x-hidden">
                  <div className="grid grid-cols-1 gap-2">
                    {filteredProducts.map((item) => {
                      const added = payload.items.find(
                        (i) => i.menuItemId === item.id,
                      );
                      return (
                        <CardProductMenu
                          key={item.id}
                          item={item}
                          quantity={added?.quantity || 0}
                          notes={added?.notes}
                          onAdd={() => handleAddItem(item.id)}
                          onRemove={() => handleRemoveItem(item.id)}
                          onChangeNotes={(value) =>
                            handleNoteItem(item.id, value)
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                <div className="col-span-5 h-full overflow-y-auto overflow-x-hidden">
                  <TableResumeNewOrder
                    payload={payload}
                    selectedType={selectedType!}
                    tables={tables}
                    menu={menu!}
                  />
                  {/* <pre>{JSON.stringify(payload, null, 2)}</pre> */}
                </div>
                

                <div className="col-span-12 flex justify-between">
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
            </div>
          )}

          {/* Paso 4: Resumen */}
          {step === 4 && (
            <div>
              <textarea
                placeholder="Notas generales de la orden"
                value={payload.notes}
                onChange={() => handleChange}
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
        </div>
      </div>
    </div>,
    document.body,
  );
};
