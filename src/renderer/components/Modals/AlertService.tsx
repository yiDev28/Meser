import { useState, ReactNode } from "react";

import { FaCheck } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { FaRegCircleCheck } from "react-icons/fa6";
import { MdInfoOutline } from "react-icons/md";
import { PiWarningCircle } from "react-icons/pi";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { FaQuestion } from "react-icons/fa";
import { ButtonActionsPadding } from "../Buttons/ButtonActionsPadding";

type AlertOptions = {
  mode?: "success" | "info" | "error" | "warning" | "question";
  title?: string;
  body?: ReactNode;
  textSuccessButton?: string;
  textCancelButton?: string;
  cancelButton?: boolean;
  successButton?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

let showAlert: (options: AlertOptions) => void;

export function useAlertService() {
  const [options, setOptions] = useState<AlertOptions | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // para controlar el fade/scale

  // Mapeamos los tipos de alerta a los íconos y colores correspondientes.
  const alertConfig = {
    success: { icon: FaRegCircleCheck, color: "text-success" },
    info: { icon: MdInfoOutline, color: "text-info" },
    error: { icon: IoMdCloseCircleOutline, color: "text-error" },
    warning: { icon: PiWarningCircle, color: "text-warning" },
    question: { icon: FaQuestion, color: "text-neutral" },
  };

  showAlert = (opts: AlertOptions) => {
    setOptions(opts);
    setIsOpen(true);
    setTimeout(() => setIsVisible(true), 50); // un pequeño delay para que active la animación
  };

  const close = () => {
    setIsVisible(false);
    setIsOpen(false);
  };

  // Obtenemos el ícono y el color dinámicamente.
  const currentIcon = options?.mode ? alertConfig[options.mode].icon : null;
  const currentColor = options?.mode
    ? alertConfig[options.mode].color
    : "text-info";
  const IconComponent = currentIcon ? currentIcon : MdInfoOutline;

  return (
    isOpen && (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-dark-fixed/70  animate-fadeIn">
        {/* Caja del modal con zoom */}
        <div className="bg-background p-10 rounded-lg max-w-120 w-full animate-scaleIn">
          <div className={`flex justify-center ${currentColor}`}>
            {IconComponent && <IconComponent size={80} />}
          </div>
          <h2 className="text-3xl font-bold text-center text-neutral-dark my-3 ">
            {options?.title || "Atención"}
          </h2>
          <div className="my-3  text-lg text-center">{options?.body || ""}</div>
          <div className="mt-6 flex justify-center space-x-2">
            {options?.cancelButton && (
              <ButtonActionsPadding
                mode="info"
                label={options?.textCancelButton || "Cancelar"}
                onClick={() => {
                  close();
                  options.onCancel?.();
                }}
                icon={MdClose}
              />
            )}
            {options?.successButton && (
              <ButtonActionsPadding
                mode="primary"
                label={options?.textSuccessButton || "Aceptar"}
                onClick={() => {
                  close();
                  options.onSuccess?.();
                }}
                icon={FaCheck}
              />
            )}
          </div>
        </div>
      </div>
    )
  );
}

export function defaultAlert(options: AlertOptions) {
  if (typeof showAlert === "function") {
    showAlert(options);
  } else {
    console.error("AlertService not initialized.");
  }
}
