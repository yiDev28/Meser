import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { OrderDTO } from "@/interfaces/order";
import { masonryBreakpoints } from "@/renderer/utils/masonry";
import { useOrdersPanel } from "./context/OrderMonitorContext";
import CardOrder from "./components/CardOrder";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";

function PanelPage() {
  const context = useOrdersPanel();
  const orders: OrderDTO[] = context?.orders ?? [];
  const alert = context?.alert;
  return (
    <div className="w-full px-4">
      {alert && <AlertBanner alert={alert} />}
      <ResponsiveMasonry columnsCountBreakPoints={masonryBreakpoints}>
        <Masonry gutter="16px">
          {orders.map((order) => (
            <div key={order.id} className="inline-block w-full mb-4">
              <CardOrder key={order.id} order={order} />
            </div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}

export default PanelPage;
