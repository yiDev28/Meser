import { SYNC_STATUS } from "./const/syncStatus.const";

export interface SyncModelDTO {
  tableName: string;
  cloudTable: string;
  lastSync: string | null;
  syncStatus: SYNC_STATUS | null;
  syncMessage: string | null;
}

export interface PendingSyncItemDTO {
  tableName: string;
  recordId: string;
  operation: string;
  attempts: number;
  status: string;
  createdAt: string;
}

export interface SyncStatusDTO {
  isOnline: boolean;
  pendingErrorCount: number;
  pendingTotalCount: number;
}
