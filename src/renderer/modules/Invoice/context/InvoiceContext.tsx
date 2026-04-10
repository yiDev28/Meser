import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import {
  InvoiceListDTO,
  InvoiceDetailDTO,
  PaymentSummary,
  OrderTypeSummary,
} from "@/interfaces/invoice";
import { getErrorMessage } from "@/utils/errorUtils";
import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface InvoiceContextProps {
  invoices: InvoiceListDTO[];
  filteredInvoices: InvoiceListDTO[];
  selectedInvoice: InvoiceDetailDTO | null;
  summaryByPayment: PaymentSummary[];
  summaryByOrderType: OrderTypeSummary[];
  isLoading: boolean;
  alert: TypeMsg | null;
  filter: { paymentMethodId?: number; orderTypeId?: number } | null;
  fetchInvoices: () => Promise<void>;
  fetchInvoiceDetail: (invoiceId: string) => Promise<void>;
  clearSelectedInvoice: () => void;
  setFilter: (filter: { paymentMethodId?: number; orderTypeId?: number } | null) => void;
}

const InvoiceContext = createContext<InvoiceContextProps | undefined>(undefined);

function calculateSummaries(invoices: InvoiceListDTO[]): {
  summaryByPayment: PaymentSummary[];
  summaryByOrderType: OrderTypeSummary[];
} {
  const paymentMap = new Map<number, PaymentSummary>();
  const orderTypeMap = new Map<number, OrderTypeSummary>();

  for (const invoice of invoices) {
    const existingPayment = paymentMap.get(invoice.paymentMethodId);
    if (existingPayment) {
      existingPayment.count++;
      existingPayment.total += invoice.total;
    } else {
      paymentMap.set(invoice.paymentMethodId, {
        paymentMethodId: invoice.paymentMethodId,
        paymentMethodName: "",
        count: 1,
        total: invoice.total,
      });
    }

    const existingOrderType = orderTypeMap.get(invoice.orderTypeId);
    if (existingOrderType) {
      existingOrderType.count++;
      existingOrderType.total += invoice.total;
    } else {
      orderTypeMap.set(invoice.orderTypeId, {
        orderTypeId: invoice.orderTypeId,
        orderTypeName: "",
        orderTypeColor: "#666",
        count: 1,
        total: invoice.total,
      });
    }
  }

  return {
    summaryByPayment: Array.from(paymentMap.values()),
    summaryByOrderType: Array.from(orderTypeMap.values()),
  };
}

export const InvoiceProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [invoices, setInvoices] = useState<InvoiceListDTO[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDetailDTO | null>(null);
  const [summaryByPayment, setSummaryByPayment] = useState<PaymentSummary[]>([]);
  const [summaryByOrderType, setSummaryByOrderType] = useState<OrderTypeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [alert, setAlert] = useState<TypeMsg | null>(null);
  const [filter, setFilter] = useState<{ paymentMethodId?: number; orderTypeId?: number } | null>(null);

  const filteredInvoices = filter
    ? invoices.filter((inv) => {
        if (filter.paymentMethodId !== undefined) {
          if (filter.paymentMethodId > 0 && inv.paymentMethodId !== filter.paymentMethodId) return false;
        }
        if (filter.orderTypeId !== undefined && inv.orderTypeId !== filter.orderTypeId) {
          return false;
        }
        return true;
      })
    : invoices;

  useEffect(() => {
    const summaries = calculateSummaries(invoices);
    setSummaryByPayment(summaries.summaryByPayment);
    setSummaryByOrderType(summaries.summaryByOrderType);
  }, [invoices]);

  const fetchInvoices = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const response = await window.electron.getInvoicesOfDay();
      if (response.code === 0) {
        setInvoices(response.data || []);
        console.log(response.data)
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error al cargar facturas: " + getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchInvoiceDetail = useCallback(async (invoiceId: string) => {
    try {
      const response = await window.electron.getInvoiceDetail(invoiceId);
      if (response.code === 0) {
        setSelectedInvoice(response.data);
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error al cargar detalle: " + getErrorMessage(error),
      });
    }
  }, []);

  const clearSelectedInvoice = useCallback(() => {
    setSelectedInvoice(null);
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const value: InvoiceContextProps = {
    invoices,
    filteredInvoices,
    selectedInvoice,
    summaryByPayment,
    summaryByOrderType,
    isLoading,
    alert,
    filter,
    fetchInvoices,
    fetchInvoiceDetail,
    clearSelectedInvoice,
    setFilter,
  };

  return (
    <InvoiceContext.Provider value={value}>{children}</InvoiceContext.Provider>
  );
};

export const useInvoice = (): InvoiceContextProps => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error("useInvoice debe ser usado dentro de InvoiceProvider");
  }
  return context;
};
