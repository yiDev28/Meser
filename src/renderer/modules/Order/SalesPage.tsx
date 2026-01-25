import { useMemo } from "react";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";
import TableOrders from "./components/TableOrders";
import { useOrderEdit } from "./hooks/useOrderEdit";
import { ORDER_TYPE } from "@/interfaces/const/order.const";

function SalesPage() {
  const { alert, orders } = useOrderEdit();
  // separar por tipo
  const { deliveries, carries, onsites } = useMemo(() => {
    return {
      deliveries: orders.filter(
        (o) => o.type.paramType === ORDER_TYPE.DELIVERY
      ),
      carries: orders.filter((o) => o.type.paramType === ORDER_TYPE.CARRY),
      onsites: orders.filter((o) => o.type.paramType === ORDER_TYPE.ONSITE),
    };
  }, [orders]);

  return (
    <div className="w-full px-4">
      {alert ? (
        <AlertBanner alert={alert} />
      ) : (
        <>
          <section>
            <h2 className="text-xl font-bold py-2">
              {deliveries[0]?.type.name.toUpperCase()}
            </h2>

            <TableOrders orders={deliveries} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {carries[0]?.type.name.toUpperCase()}
            </h2>
            <TableOrders orders={carries} />
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-2">
              {onsites[0]?.type.name.toUpperCase()}
            </h2>
            <TableOrders orders={onsites} />
          </section>
        </>
      )}
    </div>
  );
}

export default SalesPage;
