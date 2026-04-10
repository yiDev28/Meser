import { ORDER_TYPE, OrderType } from "@/interfaces/const/order.const";
import { CreateOrderDTO, MenuDTO, OrderTypeDTO } from "@/interfaces/order";
import { TableDTO } from "@/interfaces/table";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { iconCardOrder } from "@/renderer/utils/iconsDicc";
import React from "react";
import { BiMessageSquareDetail } from "react-icons/bi";

interface TableResumeNewOrderProps {
  payload: CreateOrderDTO;
  selectedType: OrderTypeDTO;
  tables: TableDTO[];
  menu: MenuDTO;
}

const TableResumeNewOrder: React.FC<TableResumeNewOrderProps> = ({
  payload,
  selectedType,
  tables,
  menu,
}) => {
  const IconComponent = iconCardOrder[selectedType.paramType];
  return (
    <div className="rounded-lg border border-neutral-gray/50 shadow-lg p-2  gap-2 flex flex-col">
      <div className="flex items-center gap-3 text-primary bg-background p-2 rounded-lg">
        <BiMessageSquareDetail size={22} />
        <h3 className="text-lg font-semibold">Resumen de la orden</h3>
      </div>

      <table className="w-full  bg-neutral-light rounded-lg">
        <tbody>
          <tr className="border-b border-neutral-gray/50">
            <td className="py-1 px-2 font-medium bg-neutral-gray/30 w-40">
              Tipo de orden
            </td>
            <td className="py-1 px-2 font-semibold flex gap-4 items-center">
              {selectedType?.name}
              <IconComponent
                size={25}
                style={{
                  color: `${selectedType.colorLabel}`,
                }}
                className="z-10 bg-neutral-dark p-0.5 rounded-md"
              />
            </td>
          </tr>

          {(selectedType?.paramType === ORDER_TYPE.DELIVERY ||
            selectedType?.paramType === ORDER_TYPE.CARRY) && (
            <tr className="border-b border-neutral-gray/50">
              <td className="py-1 px-2 font-medium bg-neutral-gray/30">
                Cliente
              </td>
              <td className="py-1 px-2">{payload.name}</td>
            </tr>
          )}

          {selectedType?.paramType === ORDER_TYPE.DELIVERY && (
            <>
              <tr className="border-b border-neutral-gray/50">
                <td className="py-1 px-2 font-medium bg-neutral-gray/30">
                  Teléfono
                </td>
                <td className="py-1 px-2">{payload.phone}</td>
              </tr>
              <tr className="border-b border-neutral-gray/50">
                <td className="py-1 px-2 font-medium bg-neutral-gray/30">
                  Dirección
                </td>
                <td className="py-1 px-2">{payload.address}</td>
              </tr>
            </>
          )}

          {selectedType?.paramType === ORDER_TYPE.ONSITE && (
            <tr className="border-b border-neutral-gray/50">
              <td className="py-1 px-2 font-medium bg-neutral-gray/30">Mesa</td>
              <td className="py-1 px-2">
                {tables?.find((t) => t.id === payload.tableId)?.name}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <table className="w-full  bg-neutral-light rounded-lg">
        <thead className="bg-neutral-gray/30 rounded-lg">
          <tr>
            <th className="p-2 text-left">Plato</th>
            <th className="p-2 text-center w-24">Cantidad</th>
            <th className="p-2 text-center w-40">Precio</th>
          </tr>
        </thead>
        <tbody>
          {payload.items.map((i) => {
            const product = menu.menuItems.find(
              (m: { id: number }) => m.id === i.menuItemId,
            );

            return (
              <tr
                key={i.menuItemId}
                className="border-t border-neutral-gray/50"
              >
                <td className="px-2 p-1 text-sm">
                  {product?.product.name}
                  {i.notes && (
                    <p className="text-neutral-dark/70 text-sm">{i.notes}</p>
                  )}
                </td>
                <td className="px-2 p-1 font-semibold text-center">
                  {i.quantity}
                </td>
                <td className="px-2 p-1 font-bold text-right">
                  {product
                    ? formatCurrency(Number(product.price) * i.quantity)
                    : 0}
                </td>
              </tr>
            );
          })}
          <tr className="border-t border-neutral-gray/50 font-bold">
            <td colSpan={2} className="p-2 text-right">
              Total:
            </td>
            <td className="p-2 text-secondary font-bold text-lg text-right">
              {formatCurrency(
                payload.items.reduce((total, item) => {
                  const product = menu.menuItems.find(
                    (m: { id: number }) => m.id === item.menuItemId,
                  );
                  return (
                    total +
                    (product ? Number(product.price) * item.quantity : 0)
                  );
                }, 0),
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default TableResumeNewOrder;
