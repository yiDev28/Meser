import { useState, useEffect } from "react";
import { useAppConfig } from "@/renderer/hooks/useAppConfig";
import { useApp } from "@/renderer/hooks/useApp";
import { BiMinus, BiWindow, BiWindows, BiCog } from "react-icons/bi";
import { MdOutlineClose } from "react-icons/md";
import { FiMonitor } from "react-icons/fi";
import SettingsModal from "./SettingsModal";

interface TitleBarProps {
  onScreenSelectorClick?: () => void;
}

export default function TitleBar({ onScreenSelectorClick }: TitleBarProps) {
  const { getConfig, loading } = useAppConfig();
  const {
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    isMaximized,
    restartApp,
  } = useApp();
  const [maximized, setMaximized] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  useEffect(() => {
    const checkMaximized = async () => {
      const max = await isMaximized();
      setMaximized(max);
    };
    checkMaximized();

    const interval = setInterval(checkMaximized, 500);
    return () => clearInterval(interval);
  }, [isMaximized]);

  if (loading) {
    return <div className="h-8 bg-secondary" />;
  }

  const hideTitleBar = getConfig("hide_titlebar") !== "true";
  if (hideTitleBar) {
    return null;
  }

  const titleBarTitle =
    getConfig("title_bar_title") || "Meser - Todo bajo control";
  const showMinimize = getConfig("show_minimize") !== "false";
  const showMaximize = getConfig("show_maximize") !== "false";
  const showClose = getConfig("show_close") !== "false";

  return (
    <>
      <div className="flex justify-between items-center h-8 select-none bg-secondary">
        <div className="flex flex-1 h-full px-3 items-center title-bar-drag">
          <span className="text-white font-semibold">{titleBarTitle}</span>
        </div>
        <div className="title-bar-controls flex h-full">
          <button
            className="w-12 h-full bg-transparent text-neutral-light flex items-center justify-center cursor-pointer transition-colors hover:bg-neutral-gray/30"
            onClick={() => setShowSettingsModal(true)}
            title="Configuración"
          >
            <BiCog className="w-4 h-4" />
          </button>
          {onScreenSelectorClick && (
            <button
              className="w-12 h-full bg-transparent text-neutral-light flex items-center justify-center cursor-pointer transition-colors hover:bg-neutral-gray/30"
              onClick={onScreenSelectorClick}
              title="Configuración de pantalla"
            >
              <FiMonitor className="w-4 h-4" />
            </button>
          )}
          {showMinimize && (
            <button
              className="w-12 h-full bg-transparent text-neutral-light flex items-center justify-center cursor-pointer transition-colors hover:bg-neutral-gray/30"
              onClick={() => minimizeWindow()}
              title="Minimizar aplicación"
            >
              <BiMinus className="w-4 h-4" />
            </button>
          )}
          {showMaximize && (
            <button
              className="w-12 h-full bg-transparent text-neutral-light flex items-center justify-center cursor-pointer transition-colors hover:bg-neutral-gray/30"
              onClick={() => maximizeWindow()}
              title={maximized ? "Restaurar" : "Maximizar"}
            >
              {maximized ? (
                <BiWindows className="w-4 h-4" />
              ) : (
                <BiWindow className="w-4 h-4" />
              )}
            </button>
          )}
          {showClose && (
            <button
              className="w-12 h-full bg-transparent text-neutral-light flex items-center justify-center cursor-pointer transition-colors hover:bg-error/50"
              onClick={() => closeWindow()}
              title="Cerrar"
            >
              <MdOutlineClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {showSettingsModal && (
        <SettingsModal
          onClose={() => setShowSettingsModal(false)}
          onRestart={() => {
            setShowSettingsModal(false);
            restartApp();
          }}
        />
      )}
    </>
  );
}
