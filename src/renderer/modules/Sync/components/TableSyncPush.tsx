import { PendingSyncItemDTO } from "@/interfaces/sync";
import { useMemo } from "react";

interface TableSyncPushProps {
  pendingItems: PendingSyncItemDTO[];
}

export const TableSyncPush: React.FC<TableSyncPushProps> = ({
  pendingItems,
}) => {
  const pendingByTable = useMemo(() => {
    const grouped: Record<string, { pending: number; error: number }> = {};
    pendingItems.forEach((item) => {
      if (!grouped[item.tableName]) {
        grouped[item.tableName] = { pending: 0, error: 0 };
      }
      if (item.status === "PENDING") {
        grouped[item.tableName].pending++;
      } else if (item.status === "ERROR") {
        grouped[item.tableName].error++;
      }
    });
    return grouped;
  }, [pendingItems]);

  const hasPending = Object.keys(pendingByTable).length > 0;

  return (
    <>
      {hasPending ? (
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-neutral-dark/80 uppercase border-b text-center">
                <th className="p-2">Tabla</th>
                <th className="p-2">Pendientes</th>
                <th className="p-2">Errores</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-light">
              {Object.entries(pendingByTable).map(([tableName, counts]) => (
                <tr key={tableName} className="border-b border-neutral-gray/50">
                  <td className="py-2 text-neutral-dark">{tableName}</td>
                  <td className="py-1 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-secondary/10 text-secondary">
                      {counts.pending}
                    </span>
                  </td>
                  <td className="py-1 text-center">
                    <span className="px-2 py-1 rounded-full text-xs bg-error/10 text-error">
                      {counts.error}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-neutral-gray text-sm mb-4">No hay pendientes por subir</p>
      )}
    </>
  );
};
