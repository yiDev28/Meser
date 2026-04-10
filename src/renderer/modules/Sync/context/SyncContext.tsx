import { ChildrenProps, TypeMsg } from "@/interfaces/app";
import {
  SyncModelDTO,
  SyncStatusDTO,
  PendingSyncItemDTO,
} from "@/interfaces/sync";
import { getErrorMessage } from "@/utils/errorUtils";
import { createContext, useContext, useEffect, useState, useCallback, Dispatch, SetStateAction } from "react";

export interface IsSyncingState {
  pull: boolean;
  push: boolean;
  pullTable: string | null;
  pushTable: string | null;
}

interface SyncContextProps {
  models: SyncModelDTO[];
  status: SyncStatusDTO | null;
  pendingItems: PendingSyncItemDTO[];
  isLoading: boolean;
  isSyncing: IsSyncingState;
  alert: TypeMsg | null;
  fetchSyncData: () => Promise<void>;
  setIsSyncing: Dispatch<SetStateAction<IsSyncingState>>;
  setAlert: Dispatch<SetStateAction<TypeMsg | null>>;
}

const SyncContext = createContext<SyncContextProps | undefined>(undefined);

export const SyncProvider: React.FC<ChildrenProps> = ({ children }) => {
  const [models, setModels] = useState<SyncModelDTO[]>([]);
  const [status, setStatus] = useState<SyncStatusDTO | null>(null);
  const [pendingItems, setPendingItems] = useState<PendingSyncItemDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState<IsSyncingState>({
    pull: false,
    push: false,
    pullTable: null,
    pushTable: null,
  });
  const [alert, setAlert] = useState<TypeMsg | null>(null);

  const fetchSyncData = useCallback(async () => {
    setIsLoading(true);
    setAlert(null);
    try {
      const [modelsRes, statusRes, pendingRes] = await Promise.all([
        window.electron.getSyncModels(),
        window.electron.getSyncStatus(),
        window.electron.getPendingSyncItems(),
      ]);

      if (modelsRes.code === 0) {
        setModels(modelsRes.data || []);
      }

      if (statusRes.code === 0) {
        setStatus(statusRes.data || null);
      }

      if (pendingRes.code === 0) {
        setPendingItems(pendingRes.data || []);
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error al cargar datos de sincronización: " + getErrorMessage(error),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSyncData();
  }, [fetchSyncData]);

  const value: SyncContextProps = {
    models,
    status,
    pendingItems,
    isLoading,
    isSyncing,
    alert,
    fetchSyncData,
    setIsSyncing,
    setAlert,
  };

  return (
    <SyncContext.Provider value={value}>{children}</SyncContext.Provider>
  );
};

export const useSync = (): SyncContextProps => {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error("useSync debe ser usado dentro de SyncProvider");
  }
  return context;
};
