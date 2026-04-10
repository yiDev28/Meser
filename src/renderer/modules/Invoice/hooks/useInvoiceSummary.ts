import { useMemo, useCallback } from "react";
import { useParamOrder } from "@/renderer/context/ParamOrderContext";
import { useInvoice } from "../context/InvoiceContext";
import { OrderTypeSummary, PaymentSummary } from "@/interfaces/invoice";

interface OrderTypeInfo {
  id: number;
  name: string;
  colorLabel: string;
  paramType: string;
}

interface PaymentInfo {
  id: number;
  name: string;
  affectsCash?: boolean;
}

export const useInvoiceSummary = () => {
  const { orderType, typesPayments } = useParamOrder();
  const {
    invoices,
    filteredInvoices,
    summaryByPayment,
    summaryByOrderType,
    filter,
    setFilter,
  } = useInvoice();

  const getOrderTypeInfo = (orderTypeId: number): OrderTypeInfo | undefined => {
    return orderType.find((t) => t.id === orderTypeId);
  };

  const getOrderTypeName = (orderTypeId: number): string => {
    const info = getOrderTypeInfo(orderTypeId);
    return info?.name || "N/A";
  };

  const getOrderTypeColor = (orderTypeId: number): string => {
    const info = getOrderTypeInfo(orderTypeId);
    return info?.colorLabel || "#666";
  };

  const getPaymentInfo = (paymentMethodId: number): PaymentInfo | undefined => {
    return typesPayments?.paymentsTypes?.find((p) => p.id === paymentMethodId);
  };

  const getPaymentMethodName = (paymentMethodId: number): string => {
    const info = getPaymentInfo(paymentMethodId);
    return info?.name || "N/A";
  };

  const getPaymentMethodAffectsCash = (paymentMethodId: number): boolean => {
    const info = getPaymentInfo(paymentMethodId);
    return info?.affectsCash ?? true;
  };

  const handleOrderTypeClick = useCallback((orderTypeId: number) => {
    if (filter?.orderTypeId === orderTypeId) {
      setFilter(null);
    } else {
      setFilter({ orderTypeId });
    }
  }, [filter, setFilter]);

  const handlePaymentClick = useCallback((paymentMethodId: number) => {
    if (filter?.paymentMethodId === paymentMethodId) {
      setFilter(null);
    } else {
      setFilter({ paymentMethodId });
    }
  }, [filter, setFilter]);

  const summaryByOrderTypeComplete = useMemo(() => {
    return summaryByOrderType.map((summary: OrderTypeSummary) => {
      const orderTypeInfo = getOrderTypeInfo(summary.orderTypeId);
      return {
        ...summary,
        orderTypeName: orderTypeInfo?.name || "N/A",
        orderTypeColor: orderTypeInfo?.colorLabel || "#666",
      };
    });
  }, [summaryByOrderType, orderType]);

  const summaryByPaymentComplete = useMemo(() => {
    return summaryByPayment.map((summary: PaymentSummary) => {
      const paymentInfo = getPaymentInfo(summary.paymentMethodId);
      return {
        ...summary,
        paymentMethodName: paymentInfo?.name || "N/A",
      };
    });
  }, [summaryByPayment, typesPayments]);

  const totalSales = useMemo(
    () => invoices.reduce((sum, inv) => sum + inv.total, 0),
    [invoices]
  );

  const invoiceCount = invoices.length;

  return {
    totalSales,
    invoiceCount,
    summaryByPayment: summaryByPaymentComplete,
    summaryByOrderType: summaryByOrderTypeComplete,
    filter,
    setFilter,
    handleOrderTypeClick,
    handlePaymentClick,
    getOrderTypeInfo,
    getOrderTypeName,
    getOrderTypeColor,
    getPaymentMethodName,
    getPaymentMethodAffectsCash,
    filteredInvoices,
  };
};
