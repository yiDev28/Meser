import { useState } from "react";
import { useOrdersSales } from "../context/SalesContext";
import { OrderDTO } from "@/interfaces/order";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useLogin } from "../../auth/hooks/useLogin";

export const useInvoiceOrder = () => {
  const { user } = useLogin();
  const {  setOrders, setSelectedOrder } =
    useOrdersSales();

  const [openModalInvoice, setOpenModalInvoice] = useState<boolean>(false);

  const openModalInvoiceOrder = (order: OrderDTO) => {
    setOpenModalInvoice(true);
    setSelectedOrder(order);
  };

  const closeModalInvoiceOrder = () => {
    setOpenModalInvoice(false);
    setSelectedOrder(null);
  };

  const invoiceOrder = async (
    orderId: string,
    tip: number,
    paymentMethod: string
  ) => {
    const res = await window.electron.invoiceOrder(
      orderId,
      0,
      tip,
      paymentMethod,
      false,
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
    closeModalInvoiceOrder();
  };

  return {
    openModalInvoice,
    openModalInvoiceOrder,
    closeModalInvoiceOrder,
    invoiceOrder,
  };
};
