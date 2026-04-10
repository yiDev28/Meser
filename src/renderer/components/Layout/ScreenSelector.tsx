import { useEffect, useState } from "react";
import { useAppConfig } from "@/renderer/hooks/useAppConfig";
import { FiMonitor } from "react-icons/fi";
import { ButtonActions } from "../Buttons/ButtonActions";
import { MdClose } from "react-icons/md";

interface ScreenSelectorProps {
  onClose?: () => void;
  onSelect?: () => void;
  showCloseButton?: boolean;
}

export default function ScreenSelector({
  onClose,
  onSelect,
  showCloseButton = true,
}: ScreenSelectorProps) {
  const { displays, setScreenIndex, getConfig, setConfig, getDisplays } =
    useAppConfig();
  const [displaysLoading, setDisplaysLoading] = useState(true);

  useEffect(() => {
    const loadDisplays = async () => {
      await getDisplays();
      setDisplaysLoading(false);
    };
    loadDisplays();
  }, [getDisplays]);

  const handleSelect = async (index: number) => {
    await setScreenIndex(index);
    onSelect?.();
  };

  const currentScreenIndex = parseInt(getConfig("screen_index") || "0", 10);
  const autoDetectEnabled = getConfig("auto_detect_screen") === "true";

  const isLoading = displaysLoading || !displays;

  return (
    <div className="fixed inset-0 bg-dark-fixed/70 animate-fadeIn flex items-center justify-center z-50">
      <div className="bg-background p-10 rounded-lg max-w-lg w-full animate-scaleIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-dark">
            Seleccionar Pantalla
          </h2>
          {showCloseButton && onClose && (
            <ButtonActions onClick={onClose} mode="light" icon={MdClose} />
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-neutral-gray">
            Cargando pantallas...
          </div>
        ) : displays.length === 0 ? (
          <div className="text-center py-8 text-neutral-gray">
            No se detectaron pantallas
          </div>
        ) : (
          <>
            <p className="text-sm text-neutral-dark mb-4">
              Selecciona la pantalla donde deseas abrir la aplicación
            </p>

            <div className="space-y-3">
              {displays.map((display, index) => (
                <button
                  key={display.id}
                  onClick={() => handleSelect(index)}
                  className={`w-full p-4 rounded-lg border-2 flex items-center gap-4 transition-all cursor-pointer
                    ${
                      currentScreenIndex === index
                        ? "border-primary bg-secondary/30"
                        : "border-neutral-gray/50 hover:border-secondary"
                    }`}
                >
                  <FiMonitor size={24} className="text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-neutral-dark">
                      {display.label || `Pantalla ${index + 1}`}
                    </div>
                    <div className="text-sm text-neutral-gray">
                      {display.bounds.width} x {display.bounds.height}
                    </div>
                  </div>
                  {currentScreenIndex === index && (
                    <span className="ml-auto text-primary text-sm font-medium">
                      Actual
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        <div className="mt-4 pt-4 border-t border-neutral-light">
          <label className="flex items-center gap-2 text-sm text-neutral-gray">
            <input
              type="checkbox"
              checked={autoDetectEnabled}
              onChange={async (e) => {
                await setConfig("auto_detect_screen", e.target.checked ? "true" : "false");
              }}
              className="w-4 h-4 text-primary"
            />
            Detectar automáticamente la pantalla al iniciar, esto hará que la aplicación se abra en la pantalla donde se encuentre el mouse al iniciar. 
          </label>
        </div>
      </div>
    </div>
  );
}
