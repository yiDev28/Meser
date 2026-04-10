import { useState } from "react";
import { useInvoice } from "./context/InvoiceContext";
import { useInvoiceSummary } from "./hooks/useInvoiceSummary";
import { CardGeneric } from "@/renderer/components/Cards/CardGeneric";
import { iconCardOrder } from "@/renderer/utils/iconsDicc";
import { TableInvoices } from "./components/TableInvoices";
import { ModalInvoiceDetail } from "./components/ModalInvoiceDetail";
import { InvoiceListDTO } from "@/interfaces/invoice";
import { formatCurrency } from "@/renderer/utils/formatPrice";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";
import { LoaderPulse } from "@/renderer/components/Loaders/Loader";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdCleaningServices } from "react-icons/md";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";
import { TbCashRegister } from "react-icons/tb";

function InvoicesPageContent() {
  const { isLoading, alert, filter } = useInvoice();
  const {
    totalSales,
    invoiceCount,
    summaryByPayment,
    summaryByOrderType,
    setFilter,
    handleOrderTypeClick,
    handlePaymentClick,
    getOrderTypeInfo,
  } = useInvoiceSummary();
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceListDTO | null>(
    null,
  );

  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSelectInvoice = (invoice: InvoiceListDTO) => {
    setSelectedInvoice(invoice);
  };

  const handleCloseModal = () => {
    setSelectedInvoice(null);
  };

  const clearFilters = () => {
    setFilter(null);
  };

  return (
    <div className="w-full px-4 ">
      {alert && <AlertBanner alert={alert} />}

      <div className="flex justify-between items-center mb-3">
        <div>

          <p className="text-sm text-neutral-gray capitalize">{today}</p>
        </div>
        {filter && (
          <ButtonActions
            label="Limpiar filtros"
            onClick={clearFilters}
            icon={MdCleaningServices}
            mode="primary_light"
            size="sm"
          />
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoaderPulse />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <CardGeneric
                title={
                  <>
                    <TbCashRegister size={25} />
                    Total Ventas
                  </>
                }
                body={formatCurrency(totalSales)}
                mode="primary"
                size="md"
              />
              <CardGeneric
                title={
                  <>
                    <LiaFileInvoiceDollarSolid size={25} /># Facturas
                  </>
                }
                body={invoiceCount}
                mode="secondary"
                size="md"
              />

              {summaryByOrderType.map((orderType) => {
                const isSelected =
                  filter?.orderTypeId === orderType.orderTypeId;
                const orderTypeInfo = getOrderTypeInfo(orderType.orderTypeId);
                const IconComponent = orderTypeInfo
                  ? iconCardOrder[orderTypeInfo.paramType]
                  : null;
                return (
                  <CardGeneric
                    key={orderType.orderTypeId}
                    onClick={() => handleOrderTypeClick(orderType.orderTypeId)}
                    title={
                      <div className="flex items-center gap-2">
                        {IconComponent && <IconComponent size={20} />}
                        <span className="font-bold text-neutral-dark/60">
                          {orderType.orderTypeName}
                        </span>
                      </div>
                    }
                    body={
                      <span className="text-neutral-dark/70">
                        {formatCurrency(orderType.total)}
                      </span>
                    }
                    mode="customStyle"
                    size="md"
                    isSelected={isSelected}
                    customStyle={{ backgroundColor: orderType.orderTypeColor }}
                  />
                );
              })}
            </div>

            <div className="flex flex-wrap gap-3">
              {summaryByPayment.map((payment) => {
                const isSelected =
                  filter?.paymentMethodId === payment.paymentMethodId;
                return (
                  <div className="flex-1 min-w-60">
                    <CardGeneric
                      key={payment.paymentMethodId}
                      onClick={() =>
                        handlePaymentClick(payment.paymentMethodId)
                      }
                      title={payment.paymentMethodName}
                      body={formatCurrency(payment.total)}
                      mode="info"
                      size="md"
                      isSelected={isSelected}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div >
            <TableInvoices onSelectInvoice={handleSelectInvoice} />
          </div>
        </>
      )}

      {selectedInvoice && (
        <ModalInvoiceDetail
          invoice={selectedInvoice}
          isOpen={!!selectedInvoice}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default function InvoicesPage() {
  return <InvoicesPageContent />;
}
