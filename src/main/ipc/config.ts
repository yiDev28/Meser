import { ipcMain, screen } from "electron";
import AppConfig from "../models/AppConfig/AppConfigModel";
import { RESPONSE, NEW_RESPONSE } from "@/interfaces/response";
import { getMainWindow } from "../windows/main";

interface DisplayInfo {
  id: number;
  label: string;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  workArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const DEFAULT_CONFIG: Record<string, string> = {
  screen_index: "0",
  hide_titlebar: "false",
  fullscreen: "false",
  open_devtools: "false",
  show_minimize: "true",
  show_maximize: "true",
  show_close: "true",
  title_bar_title: "Meser - Todo bajo control",
  title_bar_bg: "#ff330f",
  title_bar_text_color: "#ffffff",
  sync_push_interval_ms: "300000",
  sync_pull_interval_ms: "7200000",
  sync_batch_size: "100",
  cleanup_days_to_keep: "7",
  cleanup_logs_days_to_keep: "60",
  auto_detect_screen: "true",
};

export async function initializeDefaultConfig(): Promise<void> {
  const existingConfigs = await AppConfig.findAll();
  
  if (existingConfigs.length === 0) {
    const configsToCreate = Object.entries(DEFAULT_CONFIG).map(([key, value]) => ({
      key,
      value,
    }));
    
    await AppConfig.bulkCreate(configsToCreate);
    console.log("✅ Configuración por defecto inicializada en DB");
  }
}

export async function getAllConfig(): Promise<RESPONSE<Record<string, string>>> {
  try {
    const configs = await AppConfig.findAll();
    const configMap: Record<string, string> = {};
    
    configs.forEach((config: AppConfig) => {
      configMap[config.key] = config.value;
    });
    
    return NEW_RESPONSE(200, "Configuración obtenida", configMap);
  } catch (error) {
    console.error("Error obteniendo configuración:", error);
    return NEW_RESPONSE(500, "Error al obtener configuración", {});
  }
}

export async function getConfigValue(key: string): Promise<string | null> {
  const config = await AppConfig.findByPk(key);
  return config ? config.value : null;
}

ipcMain.handle("get-all-config", async (): Promise<RESPONSE<Record<string, string>>> => {
  return await getAllConfig();
});

ipcMain.handle("get-config-value", async (_, key: string): Promise<RESPONSE<string | null>> => {
  try {
    const value = await getConfigValue(key);
    return NEW_RESPONSE(200, "Valor obtenido", value);
  } catch (error) {
    console.error("Error obteniendo valor:", error);
    return NEW_RESPONSE(500, "Error al obtener valor", null);
  }
});

ipcMain.handle("set-config-value", async (_, key: string, value: string): Promise<RESPONSE<null>> => {
  try {
    await AppConfig.upsert({
      key,
      value,
    });
    return NEW_RESPONSE(200, "Configuración actualizada", null);
  } catch (error) {
    console.error("Error guardando configuración:", error);
    return NEW_RESPONSE(500, "Error al guardar configuración", null);
  }
});

ipcMain.handle("set-config-batch", async (_, configs: Record<string, string>): Promise<RESPONSE<null>> => {
  try {
    for (const [key, value] of Object.entries(configs)) {
      await AppConfig.upsert({ key, value });
    }
    return NEW_RESPONSE(200, "Configuración actualizada", null);
  } catch (error) {
    console.error("Error guardando configuración:", error);
    return NEW_RESPONSE(500, "Error al guardar configuración", null);
  }
});

ipcMain.handle("get-displays", async (): Promise<RESPONSE<DisplayInfo[]>> => {
  try {
    const displays = screen.getAllDisplays();
    const displayInfos: DisplayInfo[] = displays.map((d, index) => ({
      id: d.id,
      label: d.label || `Pantalla ${index + 1}`,
      bounds: d.bounds,
      workArea: d.workArea,
    }));
    
    return NEW_RESPONSE(200, "Displays obtenidos", displayInfos);
  } catch (error) {
    console.error("Error obteniendo displays:", error);
    return NEW_RESPONSE(500, "Error al obtener displays", []);
  }
});

ipcMain.handle("set-screen-index", async (_, index: number): Promise<RESPONSE<null>> => {
  try {
    const displays = screen.getAllDisplays();
    
    if (index < 0 || index >= displays.length) {
      return NEW_RESPONSE(400, "Índice de pantalla inválido", null);
    }
    
    await AppConfig.upsert({ key: "screen_index", value: String(index) });
    
    const display = displays[index];
    const win = getMainWindow();
    
    if (win && display) {
      if (win.isMaximized()) {
        win.unmaximize();
      }
      
      win.setBounds(display.bounds);
      win.show();
      win.focus();
    }
    
    return NEW_RESPONSE(200, "Pantalla actualizada", null);
  } catch (error) {
    console.error("Error estableciendo pantalla:", error);
    return NEW_RESPONSE(500, "Error al establecer pantalla", null);
  }
});

ipcMain.handle("detect-display", async (): Promise<RESPONSE<number>> => {
  try {
    const cursorPoint = screen.getCursorScreenPoint();
    const display = screen.getDisplayNearestPoint(cursorPoint);
    const displays = screen.getAllDisplays();
    const index = displays.findIndex(d => d.id === display.id);
    
    const win = getMainWindow();
    if (win && display) {
      if (win.isMaximized()) {
        win.unmaximize();
      }
      win.setBounds(display.bounds);
      win.show();
      win.focus();
    }
    
    await AppConfig.upsert({ key: "screen_index", value: String(index >= 0 ? index : 0) });
    
    return NEW_RESPONSE(200, "Pantalla detectada", index >= 0 ? index : 0);
  } catch (error) {
    console.error("Error detectando pantalla:", error);
    return NEW_RESPONSE(500, "Error al detectar pantalla", 0);
  }
});