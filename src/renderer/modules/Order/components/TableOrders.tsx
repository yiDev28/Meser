import { OrderDTO } from "@/interfaces/order";
import { BadgesDefault } from "@/renderer/components/Badges/BadgesDefault";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { iconItemOrder } from "@/renderer/utils/iconsDicc";
import { formatTo12Hour } from "@/utils/dateUtil";
import { TbCashRegister } from "react-icons/tb";
import { MdLocalPhone, MdOutlineSpeakerNotes } from "react-icons/md";
import { RiEditFill } from "react-icons/ri";
import { Tooltip } from "@/renderer/components/Tooltips/Tooltip";
import { Popover } from "@/renderer/components/Popover/Popover";
import { ModalOrderEdit } from "./ModalOrderEdit";
import { useOrderEdit } from "../hooks/useOrderEdit";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { ModalInvoiceOrder } from "./ModalInvoiceOrder";
import { useInvoiceOrder } from "../hooks/useInvoiceOrder";

function TableOrders({ orders }: { orders: OrderDTO[] }) {
  const { openModalEdit, closeModalEdit, openModalOrderEdit } = useOrderEdit();
  const { openModalInvoice, openModalInvoiceOrder, closeModalInvoiceOrder } =
    useInvoiceOrder();
  return (
    <div className="rounded-lg border border-neutral-gray/50 shadow-md m-2 overflow-x-auto">
      <table className="min-w-[1000px] w-full border-collapse bg-neutral-light text-left text-sm text-neutral-dark">
        <thead>
          <tr
            style={{ backgroundColor: orders[0]?.type.colorLabel }}
            className="text-center"
          >
            <th className="py-3 px-4">#</th>
            <th className="py-3 px-4">Inicio</th>
            <th className="py-3 px-4">Cantidad</th>
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Telefono</th>
            <th className="py-3 px-4">Dirección</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Acciones</th>
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
                      <h4 className="font-semibold mb-2">
                        Detalle de productos
                      </h4>
                      <ul>
                        {order.items.map((item) => {
                          return (
                            <li>
                              {item.quantity} - {item.menuItem.product.name}
                              <p className="text-xs text-gray-600">
                                {item.notes}
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </Popover>
                </td>
                <td className="py-1 px-2 font-semibold">
                  <Tooltip
                    text={order.guestCustomer?.name || ""}
                    position="bottom"
                  >
                    {order.guestCustomer?.name}
                  </Tooltip>
                </td>
                <td className="py-1 px-2 ">
                  <div className="flex items-center gap-1">
                    <span className="bg-neutral-gray/20 rounded p-1">
                      <MdLocalPhone className="text-neutral-gray " />
                    </span>
                    <span>{order.guestCustomer?.phone}</span>
                  </div>
                </td>
                <td className="py-1 px-2 max-w-[150px] truncate">
                  <Tooltip
                    text={order.guestCustomer?.address || ""}
                    position="bottom"
                  >
                    {order.guestCustomer?.address}
                  </Tooltip>
                </td>
                <td className="py-1 px-2 whitespace-nowrap">
                  <BadgesDefault
                    text={order.orderStatus.name}
                    color={iconItemOrder[order.orderStatus.paramStatus].color}
                  />
                </td>
                <td className="py-1 px-2 whitespace-nowrap font-semibold">
                  {formatCurrency(order.totalV)}
                </td>
                <td className="py-1 px-2 gap-1.5 flex items-center justify-end">
                  {order.notes && (
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
                      {order.notes}
                    </Popover>
                  )}

                  <ButtonActions
                    size="lg"
                    mode="quaternary_light"
                    icon={RiEditFill}
                    onClick={() => openModalOrderEdit(order)}
                  />
                  <ButtonActions
                    size="lg"
                    mode="primary"
                    icon={TbCashRegister}
                    onClick={() => openModalInvoiceOrder(order)}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ModalOrderEdit isOpen={openModalEdit} onClose={closeModalEdit} />
      <ModalInvoiceOrder
        isOpen={openModalInvoice}
        onClose={closeModalInvoiceOrder}
      />
    </div>
  );
}

export default TableOrders;
