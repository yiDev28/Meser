import { SyncModelDTO } from "@/interfaces/sync";
import { SYNC_STATUS } from "@/interfaces/const/syncStatus.const";
import { ButtonActions } from "@/renderer/components/Buttons/ButtonActions";

interface TableSyncPullProps {
  models: SyncModelDTO[];
  isSyncing: { pull: boolean; pullTable: string | null };
  onDownloadTable: (tableName: string) => void;
  disabled?: boolean;
}

export const TableSyncPull: React.FC<TableSyncPullProps> = ({
  models,
  isSyncing,
  onDownloadTable,
  disabled = false,
}) => {
  const formatLastSync = (lastSync: string | null) => {
    if (!lastSync) return "Nunca";
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? "s" : ""}`;
    if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? "s" : ""}`;
    if (diffMins > 0) return `hace ${diffMins} minuto${diffMins > 1 ? "s" : ""}`;
    return "Ahora mismo";
  };

  const getStatusBadge = (status: SYNC_STATUS | null, message: string | null) => {
    if (isSyncing.pull || isSyncing.pullTable !== null) {
      return <span className="text-sm text-secondary">Descargando...</span>;
    }

    const isError = status === SYNC_STATUS.ERROR;
    return (
      <span
        className={`text-sm ${isError ? "text-error" : "text-success"}`}
        title={isError && message ? message : undefined}
      >
        {status || "Nunca"}
      </span>
    );
  };

  const isAnySyncing = isSyncing.pull || isSyncing.pullTable !== null;

  return (
    <>
      {models.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-neutral-dark/80 uppercase border-b text-center">
                <th className="p-2">Tabla</th>
                <th className="p-2">Última Sync</th>
                <th className="p-2">Estado</th>
                <th className="p-2">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light">
              {models.map((model) => (
                <tr key={model.tableName} className="border-b border-neutral-gray/50">
                  <td className="py-1 text-neutral-dark">{model.tableName}</td>
                  <td className="py-1 text-neutral-gray text-center">{formatLastSync(model.lastSync)}</td>
                  <td className="py-1 text-center">
                    {getStatusBadge(model.syncStatus, model.syncMessage)}
                  </td>
                  <td className="py-1 text-center flex justify-center">
                    <ButtonActions
                      onClick={() => onDownloadTable(model.tableName)}
                      disabled={isAnySyncing || disabled || isSyncing.pullTable === model.tableName}
                      label={isSyncing.pullTable === model.tableName ? "Descargando..." : "↓ Descargar"}
                      size="sm"
                      mode="primary_light"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-neutral-gray text-sm">No hay modelos para sincronizar</p>
      )}
    </>
  );
};
