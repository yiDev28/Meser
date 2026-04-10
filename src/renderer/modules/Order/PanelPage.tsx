import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { OrderDTO } from "@/interfaces/order";
import { masonryBreakpoints } from "@/renderer/utils/masonry";
import { useOrdersPanel } from "./context/OrderMonitorContext";
import CardOrder from "./components/CardOrder";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";
import { LoaderPulse } from "@/renderer/components/Loaders/Loader";
import { useLoading } from "@/renderer/context/LoadingContext";

function PanelPage() {
  const context = useOrdersPanel();
  const orders: OrderDTO[] = context?.orders ?? [];
  const alert = context?.alert;
  const { isLoading } = useLoading();
  
    if (isLoading) {
        return (
          <div className="flex items-center justify-center h-64">
            <LoaderPulse />
          </div>
        );
      }

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
