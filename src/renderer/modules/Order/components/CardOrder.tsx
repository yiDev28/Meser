import { GiTabletopPlayers } from "react-icons/gi";
import { OrderDTO, OrderItemDTO } from "../../../../interfaces/order";
import { formatTo12Hour, getElapsedTime } from "../../../../utils/dateUtil";
import { iconCardOrder, iconItemOrder } from "../../../utils/iconsDicc";
import { useEffect, useState } from "react";
import { FaLocationDot, FaRegClock, FaUser } from "react-icons/fa6";
import { useItemsOrders } from "../hooks/useItemsOrders";
import { MdPhoneAndroid } from "react-icons/md";
import { ORDER_TYPE } from "@/interfaces/const/order.const";

interface CardOrderProps {
  order: OrderDTO;
}
const CardOrder: React.FC<CardOrderProps> = ({ order }) => {
  const { updateItemStatus } = useItemsOrders();

  const [elapsed, setElapsed] = useState(getElapsedTime(order.createdAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(getElapsedTime(order.createdAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [order.createdAt]);
  const IconComponent =
    iconCardOrder[order.type.paramType] || GiTabletopPlayers;
  const IconStatus = iconItemOrder[order.orderStatus.paramStatus].icon;
  return (
    <div
      className={`relative flex flex-col bg-clip-border rounded-lg  text-neutral-dark shadow-lg px-2 gap-2 border-5 border-neutral-light `}
      style={{
        backgroundColor: `${order.type.colorLabel}`,
        background: `linear-gradient(to bottom, ${order.type.colorLabel}, var(--color-background) )`,
      }}
    >
      {/* Contenedor principal para usar Flexbox y empujar el botón hacia abajo */}
      <div className="flex flex-col grow">
        <div className="flex justify-end mx-6">
          <div className=" bg-clip-border rounded-lg overflow-hidden text-white shadow-lg absolute -mt-6 grid h-15 w-15 place-items-center">
            <div
              style={{
                background: `linear-gradient(to top right, ${order.type.colorLabel},var(--color-neutral-light) )`,
                filter: "brightness(0.75) saturate(2.9) contrast(1.1)",
              }}
              className="absolute inset-0 z-0"
            />
            <IconComponent size={35} className="z-10 text-white" />
          </div>
        </div>
        <div className="p-2 text-left">
          <div className=" text-background  flex justify-start items-center gap-2">
            <span className="text-2xl text-neutral-dark font-bold">{`#${order.localNumber}`}</span>
            <span className="bg-neutral-gray px-5  font-bold rounded-full text-lg">
              {order.type.name}
            </span>
          </div>
          <div>
            {order.type.paramType === ORDER_TYPE.CARRY && (
              <div className="flex items-center gap-2">
                <FaUser className="text-neutral-gray" size={20} />
                <span className="font-semibold text-neutral-dark">
                  {order.metadataOrder[0].nameCustomer}
                </span>
              </div>
            )}
            {order.type.paramType === ORDER_TYPE.DELIVERY &&
              order.guestCustomer && (
                <>
                  <div className="flex items-center gap-2">
                    <FaUser className="text-neutral-gray" size={20} />
                    <span className="font-semibold text-neutral-dark">
                      {order.guestCustomer.name ||
                        order.metadataOrder[0].nameCustomer}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdPhoneAndroid className="text-neutral-gray" size={20} />
                    <span className="font-semibold text-neutral-dark">
                      {order.guestCustomer.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLocationDot className="text-neutral-gray" size={20} />
                    <span className="font-semibold text-neutral-dark">
                      {order.guestCustomer.address}{" "}
                      {order.guestCustomer.codCity}
                    </span>
                  </div>
                </>
              )}
          </div>
          <div className=" text-neutral-light my-1 flex justify-between items-center gap-2">
            <span
              className="  text-neutral-dark font-semibold px-4 py-1 rounded-full flex items-center gap-2"
              style={{
                backgroundColor: ` ${
                  iconItemOrder[order.orderStatus.paramStatus].color
                }`,
              }}
            >
              <IconStatus size={25} className="text-white" />
              <span>{order.orderStatus.name}</span>
            </span>
            {order.type.paramType === ORDER_TYPE.ONSITE && (
              <span className="text-neutral-light bg-primary px-4 rounded-full font-bold">
                {order.table.name}
              </span>
            )}
          </div>
          {/* <h4 className="text-2xl font-semibold  text-neutral-dark">
          ${order.total}
        </h4> */}
          <div className="flex justify-between items-center">
            <span className="text-neutral-dark font-semibold flex items-center gap-2">
              <FaRegClock size={20} className="text-neutral-gray" />{" "}
              {formatTo12Hour(order.createdAt.toString())}
            </span>
            <span className="text-neutral-dark bg-neutral-light px-4 rounded-full border border-neutral-gray/30">
              {elapsed}
            </span>
          </div>

          {order.metadataOrder[0].notesOrder && (
            <div className="bg-neutral-light/50 p-1 m-1 rounded border border-neutral-gray/40">
              <span className="text-sm">
                {order.metadataOrder[0].notesOrder}
              </span>
            </div>
          )}
        </div>
        <div className="border-t border-neutral-gray/40  ">
          <ul className="border border-neutral-gray/30 rounded-lg overflow-hidden w-full mt-2">
            {order.items.map((item: OrderItemDTO) => {
              const IconItems = iconItemOrder[item.itemStatus.paramStatus].icon;
              return (
                <li
                  key={item.id}
                  className="px-3 py-1 bg-background border-b last:border-none border-neutral-gray"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center justify-center">
                      <div className="mr-2 p-1 rounded text-neutral-dark font-bold">
                        {item.quantity}
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-dark/80">
                          {item.menuItem.product.name}
                        </h4>
                        <p className="text-sm">{item.notes}</p>
                      </div>
                    </div>
                    <div>
                      <button
                        className="p-1.5 text-sm flex rounded justify-items-center text-neutral-light cursor-pointer"
                        style={{
                          backgroundColor:
                            iconItemOrder[item.itemStatus.paramStatus].color,
                        }}
                        onClick={() => updateItemStatus(order.id, item.id)}
                      >
                        <IconItems size={25} />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default CardOrder;
