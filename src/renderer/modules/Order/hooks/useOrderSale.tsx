import { OrderDTO } from "@/interfaces/order";
import { useEffect, useMemo, useState } from "react";
import { useOrdersSales } from "../context/SalesContext";
import { defaultAlert } from "@/renderer/components/Modals/AlertService";
import { useLogin } from "../../auth/hooks/useLogin";
import { useParamOrder } from "@/renderer/context/ParamOrderContext";
import { ORDER_TYPES_PARAMS } from "@/interfaces/const/params.const";
import { ChargeInvoiceDTO } from "@/interfaces/invoice";
import { useInvoiceOrder } from "./useInvoiceOrder";
import { formatCurrency } from "@/renderer/utils/formatPrice";

export const useOrderSale = () => {
  const { orderType, typesPayments } = useParamOrder();
  const { user } = useLogin();
  const { selectedOrder, setSelectedOrder, setOrders } = useOrdersSales();
  const { invoiceOrder } = useInvoiceOrder();

  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [tipParam, setTipParam] = useState<boolean>(false);
  const [deliveryParam, setDeliveryParam] = useState<boolean>(false);
  const [othersChargesParam, setOthersChargesParam] = useState<boolean>(false);

  const [tip, setTip] = useState<number>(0);
  const [delivery, setDelivery] = useState<number>(0);
  const [othersCharges, setOthersCharges] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [paymentMethodSelected, setPaymentMethodSelected] = useState<number>(
    typesPayments?.default || 0,
  );

  const total = useMemo(() => {
    return subtotal + tip + delivery + othersCharges;
  }, [subtotal, tip, delivery, othersCharges]);

  const openModalOrder = (order: OrderDTO) => {
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
    quantity: number,
  ) => {
    const res = await window.electron.updateItemQuantity(
      orderId,
      orderItemId,
      quantity,
      user?.userId,
    );

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
      }),
    );

    setSelectedOrder(_order);
  };

  const cancelItemOrder = async (orderId: string, itemId: string) => {
    console.log("Si llego");
    const res = await window.electron.cancelItemStatus(
      orderId,
      itemId,
      user?.userId,
    );

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
      }),
    );

    setSelectedOrder(_order);
  };

  const handlerCancelItemOrder = async (orderId: string, itemId: string) => {
    defaultAlert({
      mode: "question",
      title: "Cancelar item de orden",
      body: "Seguro?",
      textSuccessButton: "Si",
      textCancelButton: "No",
      cancelButton: true,
      successButton: true,
      onSuccess: () => {
        cancelItemOrder(orderId, itemId);
      },
      onCancel: () => {
        return;
      },
    });
  };

  const cancelOrder = async (orderId: string) => {
    defaultAlert({
      mode: "question",
      title: "Cancelar orden",
      body: "¿Está seguro de cancelar la orden? Esta acción no se puede deshacer.",
      textSuccessButton: "Si, cancelar",
      textCancelButton: "No",
      cancelButton: true,
      successButton: true,
      onSuccess: async () => {
        const res = await window.electron.cancelOrder(orderId, user?.userId);

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
            if (order.id === _order.id) {
              return _order;
            }
            return order;
          }),
        );
        closeModalEdit();
        defaultAlert({
          mode: "success",
          title: "Orden cancelada",
          body: "La orden ha sido cancelada correctamente.",
          successButton: false,
          cancelButton: true,
          textCancelButton: "Cerrar",
        });
      },
      onCancel: () => {
        return;
      },
    });
  };

  useEffect(() => {
    if (!selectedOrder) return;

    // Reset base
    setTipParam(false);
    setDeliveryParam(false);
    setOthersChargesParam(false);

    const baseSubtotal = selectedOrder.totalV;
    setSubtotal(baseSubtotal);

    let initialTip = 0;
    let initialDelivery = 0;
    let _othersCharges = 0;

    const currentType = orderType.find(
      (t) => t.paramType === selectedOrder.type.paramType,
    );

    if (!currentType) return;

    currentType.parameters.forEach((param) => {
      const code = param.definition.code;
      const value = param.value;

      if (code === ORDER_TYPES_PARAMS.TIP) {
        setTipParam(Boolean(value));
      }

      if (code === ORDER_TYPES_PARAMS.DELIVERY) {
        setDeliveryParam(Boolean(value));
      }

      if (code === ORDER_TYPES_PARAMS.OTHER_FEES) {
        setOthersChargesParam(Boolean(value));
      }

      if (code === ORDER_TYPES_PARAMS.TIP_PERCENT) {
        initialTip = Math.round((baseSubtotal * Number(value)) / 100);
      }

      if (code === ORDER_TYPES_PARAMS.DELIVERY_FEE) {
        initialDelivery = Number(value);
      }
    });

    setTip(initialTip);
    setDelivery(initialDelivery);
    setOthersCharges(_othersCharges);
    setPaymentMethodSelected(typesPayments?.default || 0);
  }, [selectedOrder]);

  const handleConfirmInvoice = async () => {
    if (!selectedOrder) {
      defaultAlert({
        mode: "warning",
        body: "No hay orden seleccionada",
        successButton: true,
      });
      return;
    }

    // 1. Encontramos el tipo de orden una sola vez fuera de los IFs
    const currentOrderTypeParams = orderType.find(
      (t) => t.paramType === selectedOrder.type.paramType,
    )?.parameters;

    const charges: ChargeInvoiceDTO[] = [];

    // 2. Función auxiliar para evitar repetir la lógica de búsqueda
    const addChargeIfActive = (
      isActive: boolean,
      code: string,
      value: number,
    ) => {
      if (isActive && value > 0) {
        const param = currentOrderTypeParams?.find(
          (p) => p.definition.code === code,
        )?.definition;

        if (param) {
          charges.push({
            paramChargeId: param.id,
            paramChargeCode: param.code,
            total: value,
          });
        }
      }
    };

    // 3. Ejecución limpia
    addChargeIfActive(tipParam, ORDER_TYPES_PARAMS.TIP, tip);
    addChargeIfActive(deliveryParam, ORDER_TYPES_PARAMS.DELIVERY, delivery);
    addChargeIfActive(
      othersChargesParam,
      ORDER_TYPES_PARAMS.OTHER_FEES,
      othersCharges,
    );

    defaultAlert({
      mode: "question",
      title: "Facturar orden",
      body: (
        <>
          <p>¿Confirma que desea facturar la orden?</p>
          <p className="mt-2 font-bold text-primary">
            Total a facturar:{" "}
            <span className="text-neutral-dark font-bold text-2xl">
              {formatCurrency(total)}
            </span>
          </p>
        </>
      ),
      textSuccessButton: "Si, Facturar",
      textCancelButton: "Cancelar",
      cancelButton: true,
      successButton: true,
      onSuccess: () => {
        invoiceOrder(
          {
            orderId: selectedOrder.id,
            customerId: selectedOrder.guestCustomer?.id || 0,
            paymentMethod: paymentMethodSelected,
            userId: 999,
            charges: charges,
            discounts: 0,
            electronicInvoice: false,
          },
          closeModalEdit,
        );
      },
    });
  };

  return {
    updateItemQuantity,
    tipParam,
    deliveryParam,
    othersChargesParam,
    delivery,
    handlerCancelItemOrder,
    cancelOrder,
    selectedOrder,
    openModalOrder,
    openModalEdit,
    closeModalEdit,
    orderType,
    typesPayments,
    tip,
    setTip,
    total,
    othersCharges,
    setOthersCharges,
    subtotal,
    setSubtotal,
    setDelivery,
    paymentMethodSelected,
    setPaymentMethodSelected,
    handleConfirmInvoice,
  };
};
