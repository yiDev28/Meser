import { ElectronAPI } from "../../preload/electron";

export {};

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
