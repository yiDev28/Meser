import { useEffect } from "react";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { useInvoice } from "../context/InvoiceContext";
import { useInvoiceSummary } from "../hooks/useInvoiceSummary";
import { InvoiceListDTO } from "@/interfaces/invoice";

interface ModalInvoiceDetailProps {
  invoice: InvoiceListDTO;
  isOpen: boolean;
  onClose: () => void;
}

export function ModalInvoiceDetail({
  invoice,
  isOpen,
  onClose,
}: ModalInvoiceDetailProps) {
  const { selectedInvoice, fetchInvoiceDetail, clearSelectedInvoice } =
    useInvoice();
  const { getOrderTypeName, getOrderTypeColor, getPaymentMethodName } =
    useInvoiceSummary();

  useEffect(() => {
    if (isOpen && invoice) {
      fetchInvoiceDetail(invoice.id);
    }
    return () => {
      clearSelectedInvoice();
    };
  }, [isOpen, invoice, fetchInvoiceDetail, clearSelectedInvoice]);

  if (!isOpen) return null;

  const handleReprint = async () => {
    try {
      await window.electron.printInvoice(invoice.id);
    } catch (error) {
      console.error("Error al reimprimir factura:", error);
    }
  };

  const handleElectronicInvoice = () => {
    console.log("Electronic invoice:", invoice.id);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-CO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-background rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scaleIn">
        <div className="p-6 border-b border-neutral-light dark:border-dark-fixed">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-neutral-dark dark:text-neutral-light">
                Factura {invoice.number}
              </h2>
              <p className="text-sm text-neutral-gray">
                {formatDateTime(invoice.createdAt)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-gray hover:text-neutral-dark dark:hover:text-neutral-light"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-neutral-gray">Tipo de Orden</p>
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mt-1"
                style={{
                  backgroundColor: getOrderTypeColor(invoice.orderTypeId),
                }}
              >
                {getOrderTypeName(invoice.orderTypeId)}
              </span>
            </div>
            <div>
              <p className="text-xs text-neutral-gray">Método de Pago</p>
              <p className="text-sm font-medium text-neutral-dark dark:text-neutral-light mt-1">
                {getPaymentMethodName(invoice.paymentMethodId)}
              </p>
            </div>
          </div>

          <div className="border-t border-neutral-light dark:border-dark-fixed pt-4">
            <h3 className="text-sm font-semibold text-neutral-dark dark:text-neutral-light mb-3">
              Detalle de la Factura
            </h3>

            {selectedInvoice?.items ? (
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-neutral-gray">
                    <th className="text-left py-2">Producto</th>
                    <th className="text-center py-2">Cant.</th>
                    <th className="text-right py-2">Precio</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-light dark:divide-dark-fixed">
                  {selectedInvoice.items.map((item) => (
                    <tr key={item.id}>
                      <td className="py-2 text-sm text-neutral-dark dark:text-neutral-light">
                        {item.description}
                      </td>
                      <td className="py-2 text-sm text-neutral-gray text-center">
                        {item.quantity}
                      </td>
                      <td className="py-2 text-sm text-neutral-gray text-right">
                        {formatCurrency(item.unitPrice)}
                      </td>
                      <td className="py-2 text-sm text-neutral-dark dark:text-neutral-light text-right font-medium">
                        {formatCurrency(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-4 text-neutral-gray">
                Cargando detalle...
              </div>
            )}
          </div>

          <div className="border-t border-neutral-light dark:border-dark-fixed pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-gray">Subtotal</span>
              <span className="text-sm text-neutral-dark dark:text-neutral-light">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-neutral-gray">Impuesto</span>
              <span className="text-sm text-neutral-dark dark:text-neutral-light">
                {formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-neutral-light dark:border-dark-fixed">
              <span className="text-lg font-bold text-neutral-dark dark:text-neutral-light">
                Total
              </span>
              <span className="text-lg font-bold text-primary">
                {formatCurrency(invoice.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-neutral-light dark:border-dark-fixed bg-neutral-light/30 dark:bg-dark-fixed/30 flex justify-between gap-3">
          <ButtonActionsPadding
            type="button"
            label="Imprimir"
            mode="info"
            onClick={handleReprint}
          />
          <ButtonActionsPadding
            type="button"
            label="Factura Electrónica"
            mode="warning"
            onClick={handleElectronicInvoice}
          />
          <ButtonActionsPadding
            type="button"
            label="Cerrar"
            mode="secondary"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
