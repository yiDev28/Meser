import { useEffect, useState } from "react";
import { defaultAlert } from "../Modals/AlertService";
import { ButtonActions } from "../Buttons/ButtonActions";
import { MdClose } from "react-icons/md";

interface ConfigItem {
  value: string;
  type: string;
  category: string;
  description: string;
}

interface SettingsModalProps {
  onClose: () => void;
  onRestart: () => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  window: "Ventana",
  sync: "Sincronización",
  cleanup: "Limpieza",
  screen: "Pantalla",
  general: "General",
};

export default function SettingsModal({ onClose, onRestart }: SettingsModalProps) {
  const [configs, setConfigs] = useState<Record<string, ConfigItem>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      const response = await window.electron.getAllConfigWithDescriptions();
      if (response.code === 200 && response.data) {
        setConfigs(response.data);
      }
    } catch (err) {
      console.error("Error loading configs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, newValue: string) => {
    setChanges((prev) => ({
      ...prev,
      [key]: newValue,
    }));
  };

  const handleSave = async () => {
    if (Object.keys(changes).length === 0) {
      onClose();
      return;
    }

    defaultAlert({
      mode: "warning",
      title: "Guardar cambios",
      body: "Los cambios requerirán reiniciar la aplicación. ¿Deseas continuar?",
      successButton: true,
      textSuccessButton: "Sí, guardar y reiniciar",
      onSuccess: async () => {
        setSaving(true);
        try {
          for (const [key, value] of Object.entries(changes)) {
            await window.electron.setConfigValue(key, value);
          }
          onRestart();
        } catch (err) {
          console.error("Error saving configs:", err);
          setSaving(false);
        }
      },
      cancelButton: true,
    });
  };

  const hasChanges = Object.keys(changes).length > 0;

  const groupedConfigs = Object.entries(configs).reduce((acc, [key, config]) => {
    const category = config.category || "general";
    if (!acc[category]) acc[category] = [];
    acc[category].push([key, config]);
    return acc;
  }, {} as Record<string, [string, ConfigItem][]>);

  const categoryOrder = ["window", "screen", "sync", "cleanup", "general"];

  if (loading) {
    return (
      <div className="fixed inset-0 bg-dark-fixed/70 animate-fadeIn flex items-center justify-center z-50">
        <div className="bg-background p-10 rounded-lg max-w-2xl w-full animate-scaleIn">
          <div className="text-center py-8 text-neutral-gray">
            Cargando configuración...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-dark-fixed/70 animate-fadeIn flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg max-w-2xl w-full animate-scaleIn max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-neutral-dark">
            Configuración
          </h2>
          <ButtonActions onClick={onClose} mode="light" icon={MdClose} />
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {categoryOrder.map((category) => {
            const categoryConfigs = groupedConfigs[category];
            if (!categoryConfigs) return null;

            return (
              <div key={category} className="border border-neutral-gray/30 rounded-lg overflow-hidden">
                <div className="bg-secondary px-4 py-2">
                  <span className="text-white font-medium text-sm">
                    {CATEGORY_LABELS[category] || category}
                  </span>
                </div>
                <div className="p-3 space-y-3">
                  {categoryConfigs.map(([key, { value, type, description }]) => {
                    const currentValue = changes[key] !== undefined ? changes[key] : value;
                    const isChanged = changes[key] !== undefined;

                    return (
                      <div 
                        key={key} 
                        className={`p-2 rounded border ${isChanged ? "border-primary" : "border-neutral-gray/30"}`}
                      >
                        <div className="mb-1">
                          <span className="font-medium text-neutral-dark text-sm">{key}</span>
                          <p className="text-xs text-neutral-gray">{description}</p>
                        </div>
                        
                        {type === "boolean" ? (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={currentValue === "true"}
                              onChange={(e) => handleChange(key, e.target.checked ? "true" : "false")}
                              className="w-4 h-4 text-primary"
                            />
                            <span className="text-sm text-neutral-gray">
                              {currentValue === "true" ? "Activado" : "Desactivado"}
                            </span>
                          </label>
                        ) : type === "number" ? (
                          <input
                            type="number"
                            value={currentValue}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-gray/50 rounded text-sm"
                          />
                        ) : type === "color" ? (
                          <input
                            type="color"
                            value={currentValue}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full h-8 rounded cursor-pointer"
                          />
                        ) : (
                          <input
                            type="text"
                            value={currentValue}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className="w-full px-2 py-1 border border-neutral-gray/50 rounded text-sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-neutral-light flex justify-end gap-3">
          <ButtonActions 
            onClick={onClose} 
            label="Cancelar" 
            mode="light" 
          />
          <ButtonActions 
            onClick={handleSave} 
            label={saving ? "Guardando..." : "Guardar cambios"} 
            mode="primary"
            disabled={!hasChanges || saving}
          />
        </div>
      </div>
    </div>
  );
}