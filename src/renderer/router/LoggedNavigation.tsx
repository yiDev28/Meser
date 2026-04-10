import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

import PanelPage from "../modules/Order/PanelPage";
import { OrderMonitorProvider } from "../modules/Order/context/OrderMonitorContext";
import SalesPage from "../modules/Order/SalesPage";
import { SalesProvider } from "../modules/Order/context/SalesContext";
import InvoicesPage from "../modules/Invoice/InvoicesPage";
import { InvoiceProvider } from "../modules/Invoice/context/InvoiceContext";
import CashPage from "../modules/Cash/CashPage";
import SyncPage from "../modules/Sync/SyncPage";
import { SyncProvider } from "../modules/Sync/context/SyncContext";

export function LoggedNavigation() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/order-panel" replace />} />
          <Route
            path="/order-panel"
            element={
              <OrderMonitorProvider>
                <PanelPage />
              </OrderMonitorProvider>
            }
          />
          <Route
            path="/sales"
            element={
              <SalesProvider>
                <SalesPage />
              </SalesProvider>
            }
          />
          <Route
            path="/invoices"
            element={
              <InvoiceProvider>
                <InvoicesPage />
              </InvoiceProvider>
            }
          />
          <Route
            path="/cash-flow"
            element={<CashPage />}
          />
          <Route
            path="/sync"
            element={
              <SyncProvider>
                <SyncPage />
              </SyncProvider>
            }
          />
          <Route path="*" element={<Navigate to="/order-panel" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
