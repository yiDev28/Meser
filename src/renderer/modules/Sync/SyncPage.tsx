import { useSync } from "./hooks/useSync";
import AlertBanner from "@/renderer/components/Alerts/AlertBanner";
import { LoaderPulse } from "@/renderer/components/Loaders/Loader";
import { TableSyncPull, TableSyncPush } from "./components";
import { IoMdSync } from "react-icons/io";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { ButtonActionsPadding } from "@/renderer/components/Buttons/ButtonActionsPadding";
import { LuTimerReset } from "react-icons/lu";

function SyncPageContent() {
  const {
    models,
    status,
    pendingItems,
    isLoading,
    isSyncing,
    alert,
    fetchSyncData,
    downloadFromCloud,
    downloadTableFromCloud,
    uploadPendingToCloud,
    retryErrors,
    pushIntervalMin,
    pullIntervalHrs,
  } = useSync();

  const isAnySyncing = isSyncing.pull || isSyncing.push || isSyncing.pullTable !== null || isSyncing.pushTable !== null;

  if (isLoading && !status) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderPulse />
      </div>
    );
  }

  return (
    <div className="w-full px-3">
      {alert && <AlertBanner alert={alert} />}

      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-dark">
            Sincronización
          </h1>
          <p className="text-sm text-neutral-gray mt-1">
            Push: cada {pushIntervalMin} min | Pull: cada {pullIntervalHrs} h
          </p>
        </div>
        <ButtonActionsPadding
          onClick={fetchSyncData}
          disabled={isAnySyncing}
          icon={IoMdSync}
          mode="primary_light"
        />
      </div>

      <div className="bg-neutral-light rounded-lg shadow-lg p-4 mb-3">
        <div className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-full ${
              status?.isOnline ? "bg-success" : "bg-error"
            }`}
          />
          <span className="text-sm text-neutral-dark">
            {status?.isOnline ? "Conectado a Supabase" : "Sin conexión"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-3">
        <div className="bg-neutral-light rounded-lg shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-dark flex items-center gap-4">
              <FaDownload className="w-5 h-5 text-secondary" />
              Descargar desde Nube (Pull)
            </h2>
            <ButtonActionsPadding
              type="button"
              label={isSyncing.pull ? "Descargando..." : "Descargar Todas"}
              mode="secondary"
              onClick={downloadFromCloud}
              size="sm"
              icon={FaDownload}
              disabled={isAnySyncing || models.length === 0}
            />
          </div>

          <TableSyncPull
            models={models}
            isSyncing={isSyncing}
            onDownloadTable={downloadTableFromCloud}
            disabled={isAnySyncing}
          />
        </div>

        <div className="bg-neutral-light rounded-lg shadow-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-dark flex items-center gap-2">
              <FaUpload className="w-5 h-5 text-secondary" />
              Subir a Nube (Push)
            </h2>
            <div className="flex gap-2">
              <ButtonActionsPadding
                type="button"
                label={isSyncing.push ? "Reintentando..." : "Reset Errores"}
                mode="primary"
                onClick={retryErrors}
                disabled={isAnySyncing || pendingItems.length === 0}
                size="sm"
                icon={LuTimerReset}
              />
              <ButtonActionsPadding
                type="button"
                label={isSyncing.push ? "Subiendo..." : "Subir Todas"}
                mode="secondary"
                onClick={uploadPendingToCloud}
                disabled={isAnySyncing || pendingItems.length === 0}
                size="sm"
                icon={FaUpload}
              />
            </div>
          </div>

          <div className="bg-background border border-neutral-gray/50 rounded-lg shadow-lg p-4 mx-3">
            <div className="flex justify-between items-center text-sm text-neutral-gray">
              <span>Total pendientes: {status?.pendingTotalCount || 0}</span>
              <span>Errores: {status?.pendingErrorCount || 0}</span>
            </div>
          </div>

          <TableSyncPush
            pendingItems={pendingItems}
          />
        </div>
      </div>
    </div>
  );
}

export default function SyncPage() {
  return <SyncPageContent />;
}
