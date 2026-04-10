import { useOrdersSales } from "../context/SalesContext";
import { OrderDTO } from "@/interfaces/order";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { CreateInvoiceDTO } from "@/interfaces/invoice";

export const useInvoiceOrder = () => {
  const { setOrders } = useOrdersSales();

  const invoiceOrder = async (
    orderData: CreateInvoiceDTO,
    onClose?: () => void,
  ) => {
    const userId = orderData.userId || 999;
    
    let cashRegisterId: string | undefined = orderData.cashRegisterId;
    if (!cashRegisterId) {
      const cashResponse = await window.electron.getCurrentCashRegister(userId);
      if (cashResponse.code === 0 && cashResponse.data) {
        cashRegisterId = cashResponse.data.id;
      }
    }
    
    const orderWithCash: CreateInvoiceDTO = {
      ...orderData,
      userId,
      cashRegisterId,
    };
    
    console.log("invoiceOrder called with:", orderWithCash);
    const res = await window.electron.invoiceOrder(orderWithCash);

    if (res.code !== 0) {
      defaultAlert({
        mode: "warning",
        body: `${res.msg}`,
        successButton: true,
      });
      return;
    }
    
    const _order = res.data;
    if (_order) {
      setOrders((prevOrders: OrderDTO[]) =>
        prevOrders.map((order) => {
          if (order.id === _order.id) {
            return _order;
          }
          return order;
        }),
      );
    }

    defaultAlert({
      mode: "success",
      title: res.msg,
      body: res.msg,
      successButton: false,
      cancelButton: true,
      textCancelButton: "Cerrar",
      onCancel: () => {
        if (onClose) onClose();
      },
    });
  };

  return {
    invoiceOrder,
  };
};
