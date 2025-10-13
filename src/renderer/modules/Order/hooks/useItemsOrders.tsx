import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useOrdersPanel } from "../context/OrderMonitorContext";
import { OrderDTO } from "@/interfaces/order";
import { useLogin } from "../../auth/hooks/useLogin";

export const useItemsOrders = () => {
  const { setOrders } = useOrdersPanel();
  const { user } = useLogin();

  const updateItemStatus = async (orderId: string, itemId: string) => {
    console.log(user);
    const res = await window.electron.updateItemStatus(
      orderId,
      itemId,
      user?.userId
    );

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }

    setOrders((prevOrders: OrderDTO[]) =>
      prevOrders.map((order) => {
        // Si el ID de la orden actual coincide con el de la orden actualizada,
        // retornamos el objeto `updatedOrder` completo.
        if (order.id === res.data.id) {
          return res.data;
        }
        // Si no coincide, devolvemos la orden original sin cambios.
        return order;
      })
    );
  };

  return { updateItemStatus };
};
