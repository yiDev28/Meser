import { useState, useEffect, useCallback } from "react";

interface DisplayInfo {
  id: number;
  label: string;
  bounds: { x: number; y: number; width: number; height: number };
  workArea: { x: number; y: number; width: number; height: number };
}

interface AppConfigHook {
  config: Record<string, string> | null;
  loading: boolean;
  error: string | null;
  getConfig: (key: string) => string | undefined;
  setConfig: (key: string, value: string) => Promise<void>;
  reloadConfig: () => Promise<void>;
  displays: DisplayInfo[];
  getDisplays: () => Promise<void>;
  setScreenIndex: (index: number) => Promise<void>;
  detectDisplay: () => Promise<number>;
}

export const useAppConfig = (): AppConfigHook => {
  const [config, setConfigState] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [displays, setDisplays] = useState<DisplayInfo[]>([]);

  const loadConfig = useCallback(async () => {
    try {
      setLoading(true);
      const response = await window.electron.getAllConfig();
      if (response.code === 200 && response.data) {
        setConfigState(response.data);
        setError(null);
      } else {
        setError(response.msg);
      }
    } catch (err) {
      setError("Error al cargar configuración");
      console.error("Error loading config:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getDisplays = useCallback(async () => {
    try {
      const response = await window.electron.getDisplays();
      if (response.code === 200 && response.data) {
        setDisplays(response.data);
      }
    } catch (err) {
      console.error("Error getting displays:", err);
    }
  }, []);

  const getConfig = useCallback((key: string): string | undefined => {
    return config?.[key];
  }, [config]);

  const setConfig = useCallback(async (key: string, value: string) => {
    try {
      await window.electron.setConfigValue(key, value);
      await loadConfig();
    } catch (err) {
      console.error("Error setting config:", err);
    }
  }, [loadConfig]);

  const setScreenIndex = useCallback(async (index: number) => {
    try {
      await window.electron.setScreenIndex(index);
    } catch (err) {
      console.error("Error setting screen index:", err);
    }
  }, []);

  const detectDisplay = useCallback(async (): Promise<number> => {
    try {
      const response = await window.electron.detectDisplay();
      return response.data ?? 0;
    } catch (err) {
      console.error("Error detecting display:", err);
      return 0;
    }
  }, []);

  useEffect(() => {
    loadConfig();
  }, [loadConfig]);

  return {
    config,
    loading,
    error,
    getConfig,
    setConfig,
    reloadConfig: loadConfig,
    displays,
    getDisplays,
    setScreenIndex,
    detectDisplay,
  };
};