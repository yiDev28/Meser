import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  OrderDTO,
  TypePaymentDTO,
  TypePaymentObjDTO,
} from "@/interfaces/order";
import { ImCancelCircle } from "react-icons/im";
import { RiSubtractLine, RiAddLine } from "react-icons/ri";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { MdClose, MdDeliveryDining } from "react-icons/md";
import { BiEdit } from "react-icons/bi";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { TbBasketCancel, TbTipJar } from "react-icons/tb";
import { ORDER_STATUS, ORDER_TYPE } from "@/interfaces/const/order.const";
import { iconCardOrder, iconItemOrder } from "@/renderer/utils/iconsDicc";
import { BadgesDefault } from "@/renderer/components/Badges/BadgesDefault";
import { InputGeneric } from "@/renderer/components/Inputs/InputGeneric";
import { BsCashCoin } from "react-icons/bs";
import { RadioCustomCard } from "@/renderer/components/Inputs/RadioCustomCard";
import { PiInvoiceFill } from "react-icons/pi";

interface ModalOrderEditProps {
  isOpen: boolean;
  onClose: () => void;
  updateItemQuantity: (
    orderId: string,
    itemOrderId: string,
    quantity: number,
  ) => void;
  handlerCancelItemOrder: (orderId: string, itemOrderId: string) => void;
  cancelOrder: (id: string) => void;
  handleConfirmInvoice: () => void;
  selectedOrder: OrderDTO | null;
  tip: number;
  delivery: number;
  othersCharges: number;
  subtotal: number;
  total: number;
  setDelivery: any;
  setTip: any;
  setOthersCharges: any;
  tipParam: boolean;
  deliveryParam: boolean;
  othersChargesParam: boolean;
  typesPayments: TypePaymentObjDTO | undefined;
  setPaymentMethodSelected: any;
  paymentMethodSelected: number;
}

export function ModalOrderSales({
  isOpen,
  onClose,
  updateItemQuantity,
  handlerCancelItemOrder,
  cancelOrder,
  selectedOrder,
  tip,
  subtotal,
  othersCharges,
  deliveryParam,
  total,
  othersChargesParam,
  setOthersCharges,
  setDelivery,
  setTip,
  tipParam,
  delivery,
  typesPayments,
  setPaymentMethodSelected,
  paymentMethodSelected,
  handleConfirmInvoice,
}: ModalOrderEditProps) {
  // Cerrar con ESC
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Inicializar propina cuando se abre

  if (!isOpen || !selectedOrder) return null;

  const tipPercentages = [0, 5, 10, 15, 20];
  const deliveryFeed = [1000, 2000, 3000, 4000, 5000];

  const handleTipSelect = (percent: number) => {
    setTip((subtotal * percent) / 100);
  };

  const handleDeliverySelect = (mount: number) => {
    setDelivery(mount);
  };

  const handleTypePaymentSelect = (id: string) => {
    const numericId = Number(id);
    setPaymentMethodSelected(numericId);
  };

  const IconComponent = iconCardOrder[selectedOrder.type.paramType];

  return createPortal(
    <div className="fixed inset-0 z-9998 flex items-center justify-center bg-neutral-dark/70 p-4 overflow-auto animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg  md:max-w-[95vw] w-full p-6 relative max-h-[95vh]">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold flex items-center gap-3 text-secondary">
            <BiEdit /> Orden #{selectedOrder.localNumber}
          </h2>
          <ButtonActionsPadding
            label="Cancelar orden"
            mode="danger"
            onClick={() => cancelOrder(selectedOrder.id)}
            icon={TbBasketCancel}
          />
          <ButtonActions onClick={onClose} mode="light" icon={MdClose} />
        </div>

        {/* Datos cliente */}

        {/* Items */}
        <div className="flex gap-3">
          <div className="overflow-y-auto overflow-x-hidden h-auto max-h-[80vh] w-10/15">
            <table className="w-full  bg-neutral-light rounded-lg">
              <thead className="bg-neutral-gray/30 rounded-lg">
                <tr>
                  <th className="p-2 text-left"></th>
                  <th className="p-2 text-left">Plato</th>
                  <th className="p-2 text-center w-40">Estado</th>
                  <th className="p-2 text-center w-24">Cantidad</th>
                  <th className="p-2 text-center w-40">Precio</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((i) => {
                  return (
                    <tr
                      key={i.menuItem.id}
                      className="border-t border-neutral-gray/50"
                    >
                      <td className=" justify-items-center">
                        {i.itemStatus.paramStatus != ORDER_STATUS.CANCELED && (
                          <ButtonActions
                            icon={ImCancelCircle}
                            onClick={() =>
                              handlerCancelItemOrder(selectedOrder.id, i.id)
                            }
                            mode="danger_light"
                            size="sm"
                          />
                        )}
                      </td>
                      <td className="px-4 p-1">
                        {i.menuItem.product.name}
                        {i.notes && (
                          <p className="text-neutral-dark/70 text-sm">
                            {i.notes}
                          </p>
                        )}
                      </td>
                      <td className="justify-items-center">
                        <div>
                          <BadgesDefault
                            text={i.itemStatus.name}
                            color={
                              iconItemOrder[i.itemStatus.paramStatus].color
                            }
                          />
                        </div>
                      </td>
                      <td className="justify-items-center">
                        <div className="flex items-center gap-2">
                          <ButtonActions
                            onClick={() =>
                              updateItemQuantity(
                                selectedOrder.id,
                                i.id,
                                i.quantity - 1,
                              )
                            }
                            disabled={
                              i.quantity <= 1 ||
                              i.itemStatus.paramStatus === ORDER_STATUS.CANCELED
                            }
                            icon={RiSubtractLine}
                            mode="danger"
                            size="sm"
                          />

                          <span className="min-w-[2ch] text-center">
                            {i.quantity}
                          </span>
                          <ButtonActions
                            onClick={() =>
                              updateItemQuantity(
                                selectedOrder.id,
                                i.id,
                                i.quantity + 1,
                              )
                            }
                            disabled={
                              i.itemStatus.paramStatus === ORDER_STATUS.CANCELED
                            }
                            icon={RiAddLine}
                            mode="success"
                            size="sm"
                          />
                        </div>
                      </td>
                      <td className="px-4 p-1 font-bold text-right">
                        {formatCurrency(Number(i.menuItem.price) * i.quantity)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="w-5/15 border border-neutral-gray/30 rounded-lg overflow-y-auto overflow-x-hidden h-auto max-h-[80vh]">
            <div>
              <table className="w-full  bg-neutral-light rounded-lg">
                <tbody>
                  <tr className="border-b border-neutral-gray/50">
                    <td className="py-1 px-4 font-medium bg-neutral-gray/30 w-35">
                      Tipo orden
                    </td>
                    <td className="py-1 px-4 font-semibold flex gap-4 items-center">
                      {selectedOrder.type?.name}
                      <IconComponent
                        size={25}
                        style={{
                          color: `${selectedOrder.type.colorLabel}`,
                        }}
                        className="z-10 bg-neutral-dark p-0.5 rounded-md"
                      />
                    </td>
                  </tr>

                  {(selectedOrder.type?.paramType === ORDER_TYPE.DELIVERY ||
                    selectedOrder.type?.paramType === ORDER_TYPE.CARRY) && (
                    <tr className="border-b border-neutral-gray/50">
                      <td className="py-1 px-4 font-medium bg-neutral-gray/30">
                        Cliente
                      </td>
                      <td className="py-1 px-4">
                        {selectedOrder.guestCustomer?.name ||
                          selectedOrder.metadataOrder[0].nameCustomer}
                      </td>
                    </tr>
                  )}

                  {selectedOrder.type?.paramType === ORDER_TYPE.DELIVERY && (
                    <>
                      <tr className="border-b border-neutral-gray/50">
                        <td className="py-1 px-4 font-medium bg-neutral-gray/30">
                          Teléfono
                        </td>
                        <td className="py-1 px-4">
                          {selectedOrder.guestCustomer?.phone}
                        </td>
                      </tr>
                      <tr className="border-b border-neutral-gray/50">
                        <td className="py-1 px-4 font-medium bg-neutral-gray/30">
                          Dirección
                        </td>
                        <td className="py-1 px-4">
                          {selectedOrder.guestCustomer?.address}
                        </td>
                      </tr>
                    </>
                  )}

                  {selectedOrder.type?.paramType === ORDER_TYPE.ONSITE && (
                    <tr className="border-b border-neutral-gray/50">
                      <td className="py-1 px-4 font-medium bg-neutral-gray/30">
                        Mesa
                      </td>
                      <td className="py-1 px-4">{selectedOrder.table.name}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Totales */}
            <div className="mt-3 space-y-3 text-right  p-2">
              <div>
                <div className="flex justify-end items-center gap-2">
                  <p className="text-lg font-bold text-primary">Subtotal:</p>{" "}
                  <div className="w-35 font-bold">
                    <InputGeneric
                      type="text"
                      value={formatCurrency(subtotal)}
                      textAlign="right"
                      disabled={true}
                    />
                  </div>
                </div>
              </div>
              {tipParam && (
                <div>
                  <div className="flex justify-end items-center gap-2">
                    <p className="text font-semibold text-secondary">
                      Propina:
                    </p>
                    <div className="w-35">
                      <InputGeneric
                        type="number"
                        value={tip}
                        onChange={(e) => setTip(Number(e.target.value))}
                        icon={TbTipJar}
                        textAlign="right"
                        onFocus={() => setTip(Number(0))}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 m-3 ">
                    {tipPercentages.map((percent) => (
                      <ButtonActions
                        key={percent}
                        mode="quaternary_light"
                        label={`${percent} %`}
                        size="xs"
                        onClick={() => handleTipSelect(percent)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {deliveryParam && (
                <div>
                  <div className="flex justify-end items-center gap-2">
                    <p className="text font-semibold text-secondary">
                      Domicilio:
                    </p>
                    <div className="w-35">
                      <InputGeneric
                        type="number"
                        value={delivery}
                        onChange={(e) =>
                          setDelivery(Number(e.target.value))
                        }
                        icon={MdDeliveryDining}
                        textAlign="right"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 m-3 ">
                    {deliveryFeed.map((fee) => (
                      <ButtonActions
                        key={fee}
                        mode="primary_light"
                        label={`${formatCurrency(fee)}`}
                        size="xs"
                        onClick={() => handleDeliverySelect(fee)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {othersChargesParam && (
                <div className="flex justify-end items-center gap-2">
                  <p className="text font-semibold text-secondary">
                    Otros cobros:
                  </p>
                  <div className="w-35">
                    <InputGeneric
                      type="number"
                      value={othersCharges}
                      onChange={(e) => setOthersCharges(Number(e.target.value))}
                      icon={BsCashCoin}
                      textAlign="right"
                    />
                  </div>
                </div>
              )}
              {/* Tipo de pago */}
              <div className="flex flex-row flex-wrap justify-end mt-3 gap-1">
                {typesPayments &&
                  typesPayments.status &&
                  typesPayments.paymentsTypes?.map((pay: TypePaymentDTO) => {
                    return (
                      <div key={pay.id}>
                        <RadioCustomCard
                          value={pay.id}
                          name="payment-type"
                          id={pay.code}
                          label={pay.name}
                          onChange={(e) =>
                            handleTypePaymentSelect(e.target.value)
                          }
                          checked={paymentMethodSelected === pay.id}
                        size="sm"

                        />
                      </div>
                    );
                  })}
              </div>

              <div className="flex justify-end items-center gap-2">
                <p className="text-xl font-bold text-primary">Total:</p>{" "}
                <div className="w-40 font-bold">
                  <InputGeneric
                    type="text"
                    value={formatCurrency(total)}
                    textAlign="right"
                    disabled={true}
                    size="lg"
                  />
                </div>
              </div>

              {/* Botón confirmar */}
              <div className="mt-3 flex justify-end">
                <ButtonActionsPadding
                  label="Confirmar - Facturar"
                  icon={PiInvoiceFill}
                  onClick={handleConfirmInvoice}
                  mode="primary"
                  size="lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
