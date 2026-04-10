import { useCallback } from "react";
import {
  SyncModelDTO,
  SyncStatusDTO,
  PendingSyncItemDTO,
} from "@/interfaces/sync";
import { getErrorMessage } from "@/utils/errorUtils";
import { useSync as useSyncContext, IsSyncingState } from "../context/SyncContext";

interface UseSyncReturn {
  models: SyncModelDTO[];
  status: SyncStatusDTO | null;
  pendingItems: PendingSyncItemDTO[];
  isLoading: boolean;
  isSyncing: IsSyncingState;
  alert: { type: string; msg: string } | null;
  fetchSyncData: () => Promise<void>;
  downloadFromCloud: () => Promise<void>;
  downloadTableFromCloud: (tableName: string) => Promise<void>;
  uploadPendingToCloud: () => Promise<void>;
  retryErrors: () => Promise<void>;
}

export const useSync = (): UseSyncReturn => {
  const {
    models,
    status,
    pendingItems,
    isLoading,
    isSyncing,
    alert,
    fetchSyncData: fetchData,
    setIsSyncing,
    setAlert,
  } = useSyncContext();

  const fetchSyncData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const downloadFromCloud = useCallback(async () => {
    setIsSyncing((prev: IsSyncingState) => ({ ...prev, pull: true }));
    setAlert(null);
    try {
      const response = await window.electron.syncPullAll();
      if (response.code === 0) {
        setAlert({ type: "SUCCESS", msg: "Descarga desde nube completada" });
        await fetchSyncData();
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error en download: " + getErrorMessage(error),
      });
    } finally {
      setIsSyncing((prev: IsSyncingState) => ({ ...prev, pull: false }));
    }
  }, [fetchSyncData, setIsSyncing, setAlert]);

  const downloadTableFromCloud = useCallback(async (tableName: string) => {
    setIsSyncing((prev: IsSyncingState) => ({ ...prev, pullTable: tableName }));
    setAlert(null);
    try {
      const response = await window.electron.syncPullTable(tableName);
      if (response.code === 0) {
        setAlert({ type: "SUCCESS", msg: `Descarga de ${tableName} completada` });
        await fetchSyncData();
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error en download table: " + getErrorMessage(error),
      });
    } finally {
      setIsSyncing((prev: IsSyncingState) => ({ ...prev, pullTable: null }));
    }
  }, [fetchSyncData, setIsSyncing, setAlert]);

  const uploadPendingToCloud = useCallback(async () => {
    setIsSyncing((prev: IsSyncingState) => ({ ...prev, push: true }));
    setAlert(null);
    try {
      const response = await window.electron.syncPushPending();
      if (response.code === 0) {
        setAlert({ type: "SUCCESS", msg: "Subida de pendientes completada" });
        await fetchSyncData();
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error en upload: " + getErrorMessage(error),
      });
    } finally {
      setIsSyncing((prev: IsSyncingState) => ({ ...prev, push: false }));
    }
  }, [fetchSyncData, setIsSyncing, setAlert]);

  const retryErrors = useCallback(async () => {
    setIsSyncing((prev: IsSyncingState) => ({ ...prev, push: true }));
    setAlert(null);
    try {
      const response = await window.electron.retrySyncErrors();
      if (response.code === 0) {
        setAlert({ type: "SUCCESS", msg: response.msg });
        await fetchSyncData();
      } else {
        setAlert({ type: "WARNING", msg: response.msg });
      }
    } catch (error) {
      setAlert({
        type: "ERROR",
        msg: "Error al reintentar: " + getErrorMessage(error),
      });
    } finally {
      setIsSyncing((prev: IsSyncingState) => ({ ...prev, push: false }));
    }
  }, [fetchSyncData, setIsSyncing, setAlert]);

  return {
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
  };
};
