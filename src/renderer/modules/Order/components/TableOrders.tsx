import { OrderDTO } from "@/interfaces/order";
import { BadgesDefault } from "@/renderer/components/Badges/BadgesDefault";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { iconItemOrder } from "@/renderer/utils/iconsDicc";
import { formatTo12Hour } from "@/utils/dateUtil";
import { MdLocalPhone, MdOutlineSpeakerNotes } from "react-icons/md";
import { Tooltip } from "@/renderer/components/Tooltips/Tooltip";
import { Popover } from "@/renderer/components/Popover/Popover";
import { ModalOrderSales } from "./ModalOrderSale";
import { useOrderSale } from "../hooks/useOrderSale";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { ORDER_TYPE } from "@/interfaces/const/order.const";
import { TbCashRegister } from "react-icons/tb";

interface TableOrders {
  orders: OrderDTO[];
}

function TableOrders({ orders }: { orders: OrderDTO[] }) {
  const {
    openModalEdit,
    closeModalEdit,
    openModalOrder,
    updateItemQuantity,
    handlerCancelItemOrder,
    cancelOrder,
    selectedOrder,
    tip,
    setTip,
    tipParam,
    subtotal,
    othersCharges,
    deliveryParam,
    total,
    othersChargesParam,
    setOthersCharges,
    setDelivery,
    delivery,
    typesPayments,
    paymentMethodSelected,
    setPaymentMethodSelected,
    handleConfirmInvoice,
  } = useOrderSale();

  return (
    <div className="rounded-lg border border-neutral-gray/50 shadow-lg m-2 overflow-x-auto">
      <table className="min-w-250 w-full border-collapse bg-neutral-light text-left text-sm text-neutral-dark">
        <thead>
          <tr
            style={{ backgroundColor: orders[0]?.type.colorLabel }}
            className="text-center"
          >
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Inicio</th>
            <th className="py-3 px-4">Cantidad</th>
            <th className="py-3 px-4">
              {orders[0]?.type.paramType === ORDER_TYPE.ONSITE
                ? "Ubicación"
                : "Nombre"}
            </th>
            {orders[0]?.type.paramType === ORDER_TYPE.DELIVERY && (
              <>
                <th className="py-3 px-4">Telefono</th>
                <th className="py-3 px-4">Dirección</th>
              </>
            )}

            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4 w-45">Total</th>
            <th className="py-3 px-4 w-45">Acciones</th>
          </tr>
        </thead>
        <tbody className="text-neutral-dark text-center">
          {orders.map((order) => {
            return (
              <tr
                className="border-b border-neutral-gray/30 hover:bg-background"
                key={order.id}
              >
                <td className="py-1 px-2 font-bold">{order.localNumber}</td>
                <td className="py-1 px-2 whitespace-nowrap">
                  {formatTo12Hour(order.createdAt.toString())}
                </td>
                <td className="py-1 px-2 whitespace-nowrap">
                  <div className="cursor-pointer">
                    <Popover
                      trigger={
                        <BadgesDefault
                          text={`${order.items.length} Items`}
                          color="var(--color-neutral-dark)"
                        />
                      }
                      placement="right"
                    >
                      <div>
                        <h4 className="font-bold mb-2 text-primary">
                          Detalle de productos
                        </h4>
                        <ul>
                          {order.items.map((item) => {
                            return (
                              <li className="text-background border-b py-1.5">
                                <div className="flex justify-between px-1">
                                  <div>{item.menuItem.product.name}</div>
                                  <div>{item.quantity}</div>
                                </div>
                                {item.notes && (
                                  <div>
                                    <p className="text-sm text-neutral-light">
                                      - {item.notes}
                                    </p>
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Popover>
                  </div>
                </td>
                <td className="py-1 px-2 font-semibold">
                  {orders[0]?.type.paramType === ORDER_TYPE.ONSITE ? (
                    <h4>{order.table.name}</h4>
                  ) : (
                    <Tooltip
                      text={
                        order.guestCustomer?.name ||
                        order.metadataOrder[0].nameCustomer ||
                        ""
                      }
                      position="bottom"
                    >
                      {order.guestCustomer?.name ||
                        order.metadataOrder[0].nameCustomer}
                    </Tooltip>
                  )}
                </td>
                {orders[0]?.type.paramType === ORDER_TYPE.DELIVERY && (
                  <>
                    <td className="py-1 px-2 ">
                      <div className="flex items-center gap-1">
                        <span className="bg-neutral-gray/20 rounded p-1">
                          <MdLocalPhone className="text-neutral-gray " />
                        </span>
                        <span>{order.guestCustomer?.phone}</span>
                      </div>
                    </td>
                    <td className="py-1 px-2 max-w-37.5 truncate">
                      <Tooltip
                        text={order.guestCustomer?.address || ""}
                        position="bottom"
                      >
                        {order.guestCustomer?.address}
                      </Tooltip>
                    </td>
                  </>
                )}
                <td className="py-1 px-2 whitespace-nowrap">
                  <BadgesDefault
                    text={order.orderStatus.name}
                    color={iconItemOrder[order.orderStatus.paramStatus].color}
                  />
                </td>
                <td className="py-1 px-2 whitespace-nowrap font-bold text-lg text-right">
                  {formatCurrency(order.totalV)}
                </td>
                <td className="py-1 px-2 gap-1.5 flex items-center justify-end">
                  {order.metadataOrder[0].notesOrder && (
                    <Popover
                      trigger={
                        <ButtonActions
                          size="lg"
                          mode="light"
                          icon={MdOutlineSpeakerNotes}
                        />
                      }
                      placement="left"
                    >
                      <div className="text-neutral-light">
                        <h3 className="font-semibold text-primary border-b mb-2">
                          Notas de la orden:
                        </h3>
                        {order.metadataOrder[0].notesOrder}
                      </div>
                    </Popover>
                  )}

                  <ButtonActions
                    size="lg"
                    mode="primary"
                    icon={TbCashRegister}
                    onClick={() => openModalOrder(order)}
                    disabled={order.orderStatus.paramStatus === "CANCELED" || order.orderStatus.paramStatus === "INVOICED"}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ModalOrderSales
        isOpen={openModalEdit}
        onClose={closeModalEdit}
        updateItemQuantity={updateItemQuantity}
        handlerCancelItemOrder={handlerCancelItemOrder}
        cancelOrder={cancelOrder}
        selectedOrder={selectedOrder}
        tipParam={tipParam}
        tip={tip}
        setTip={setTip}
        deliveryParam={deliveryParam}
        delivery={delivery}
        setDelivery={setDelivery}
        othersChargesParam={othersChargesParam}
        othersCharges={othersCharges}
        setOthersCharges={setOthersCharges}
        subtotal={subtotal}
        total={total}
        typesPayments={typesPayments}
        setPaymentMethodSelected={setPaymentMethodSelected}
        paymentMethodSelected={paymentMethodSelected}
        handleConfirmInvoice={handleConfirmInvoice}
      />
    </div>
  );
}

export default TableOrders;
