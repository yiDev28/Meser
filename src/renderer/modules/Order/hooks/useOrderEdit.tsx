import { OrderDTO } from "@/interfaces/order";
import { useState } from "react";
import { useOrdersSales } from "../context/SalesContext";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useLogin } from "../../auth/hooks/useLogin";

export const useOrderEdit = () => {
  const { user } = useLogin();
  const { alert, orders, setOrders, selectedOrder, setSelectedOrder } =
    useOrdersSales();
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);

  const openModalOrderEdit = (order: OrderDTO) => {
    setOpenModalEdit(true);
    setSelectedOrder(order);
  };

  const closeModalEdit = () => {
    setOpenModalEdit(false);
    setSelectedOrder(null);
  };

  const updateItemQuantity = async (
    orderId: string,
    orderItemId: string,
    quantity: number
  ) => {
    const res = await window.electron.updateItemQuantity(
      orderId,
      orderItemId,
      quantity,
      user?.userId
    );

    console.log(res);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }

    const _order = res.data;
    setOrders((prevOrders: OrderDTO[]) =>
      prevOrders.map((order) => {
        // Si el ID de la orden actual coincide con el de la orden actualizada,
        // retornamos el objeto `updatedOrder` completo.
        if (order.id === _order.id) {
          return _order;
        }
        // Si no coincide, devolvemos la orden original sin cambios.
        return order;
      })
    );

    setSelectedOrder(_order);
  };

  const cancelItemOrder = async (orderId: string, itemId: string) => {
    const res = await window.electron.cancelItemStatus(
      orderId,
      itemId,
      user?.userId
    );

    console.log(res);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }

    const _order = res.data;
    setOrders((prevOrders: OrderDTO[]) =>
      prevOrders.map((order) => {
        // Si el ID de la orden actual coincide con el de la orden actualizada,
        // retornamos el objeto `updatedOrder` completo.
        if (order.id === _order.id) {
          return _order;
        }
        // Si no coincide, devolvemos la orden original sin cambios.
        return order;
      })
    );

    setSelectedOrder(_order);
  };

  const cancelOrder = async (orderId: string) => {
    const res = await window.electron.cancelOrder(orderId, user?.userId);

    console.log(res);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }

    const _order = res.data;
    setOrders((prevOrders: OrderDTO[]) =>
      prevOrders.map((order) => {
        // Si el ID de la orden actual coincide con el de la orden actualizada,
        // retornamos el objeto `updatedOrder` completo.
        if (order.id === _order.id) {
          return _order;
        }
        // Si no coincide, devolvemos la orden original sin cambios.
        return order;
      })
    );
    closeModalEdit();
  };

  return {
    alert,
    orders,
    updateItemQuantity,
    cancelItemOrder,
    cancelOrder,
    selectedOrder,
    setSelectedOrder,
    openModalOrderEdit,
    openModalEdit,
    closeModalEdit,
  };
};
