import {
  formatCurrency,
  formatTimeHourMin,
} from "@/renderer/utils/formatPrice";
import { useInvoice } from "../context/InvoiceContext";
import { useInvoiceSummary } from "../hooks/useInvoiceSummary";
import { InvoiceListDTO } from "@/interfaces/invoice";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";

interface TableInvoicesProps {
  onSelectInvoice: (invoice: InvoiceListDTO) => void;
}

export function TableInvoices({ onSelectInvoice }: TableInvoicesProps) {
  const { filteredInvoices, isLoading } = useInvoice();
  const { getOrderTypeName, getOrderTypeColor, getPaymentMethodName } =
    useInvoiceSummary();

  if (isLoading) {
    return (
      <AlertBanner
        alert={{
          type: "NEUTRO",
          msg: "Cargando facturas...",
        }}
      />
    );
  }

  if (filteredInvoices.length === 0) {
    return (
      <AlertBanner
        alert={{
          type: "INFO",
          msg: "No se encontraron facturas del dia.",
        }}
      />
    );
  }

  return (
    <div className="rounded-lg border border-neutral-gray/50 shadow-lg m-2 overflow-x-auto">
      <table className="min-w-250 w-full border-collapse bg-neutral-light text-left text-sm text-neutral-dark">
        <thead>
          <tr className="text-center bg-primary text-neutral-light">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Hora</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Pago</th>
            <th className="px-4 py-3">Total</th>
          </tr>
        </thead>
        <tbody className="text-neutral-dark text-center ">
          {filteredInvoices.map((invoice) => (
            <tr
              key={invoice.id}
              onClick={() => onSelectInvoice(invoice)}
              className="border-b border-neutral-gray/30 hover:bg-background"
            >
              <td className="py-1 px-2 text-xs text-neutral-dark font-semibold">
                {invoice.number}
              </td>
              <td className="py-1 px-2 text-sm text-neutral-dark">
                {formatTimeHourMin(invoice.createdAt)}
              </td>
              <td className="py-1 px-2">
                <span
                  className="inline-flex items-center px-2 py-1 rounded-full text-xs text-neutral-dark/80 font-semibold"
                  style={{
                    backgroundColor: getOrderTypeColor(invoice.orderTypeId),
                  }}
                >
                  {getOrderTypeName(invoice.orderTypeId)}
                </span>
              </td>
              <td className="py-1 px-2 text-sm text-neutral-dark">
                {getPaymentMethodName(invoice.paymentMethodId)}
              </td>
              <td className="py-1 px-2 text-sm font-bold text-primary text-right">
                {formatCurrency(invoice.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
