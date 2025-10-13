import { useState, useRef, useEffect, ReactElement } from "react";
import { createPortal } from "react-dom";

interface PopoverProps {
  trigger: ReactElement; /// lo que dispara el popover
  children: React.ReactNode; // contenido personalizado
  placement?: "right" | "left" | "top" | "bottom"; // posición
}

export function Popover({
  trigger,
  children,
  placement = "right",
}: PopoverProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(
    null
  );
  const triggerRef = useRef<HTMLSpanElement>(null);

  const togglePopover = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();

      let top = rect.top + window.scrollY;
      let left = rect.left + window.scrollX;

      switch (placement) {
        case "right":
          left = rect.right + 8;
          top = top + rect.height - 50;
          break;
        case "left":
          left = rect.left - 265; // ancho estimado + margen
          top = top + rect.height -45;
          break;
        case "top":
          left = left + rect.width / 2 - 100;
          top = rect.top + window.scrollY - 120;
          break;
        case "bottom":
          left = left + rect.width / 2 - 100;
          top = rect.bottom + window.scrollY + 8;
          break;
      }

      setCoords({ top, left });
    }
    setOpen((prev) => !prev);
  };

  // cerrar cuando hago click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <span ref={triggerRef} onClick={togglePopover} className="inline-block">
        {trigger}
      </span>

      {open &&
        coords &&
        createPortal(
          <div
            style={{
              top: coords.top,
              left: coords.left,
              position: "absolute",
            }}
            className="relative bg-neutral-gray  rounded-lg shadow-lg p-3 w-64 z-[9999]"
          >
            {/* Contenido */}
            {children}

            {/* Flecha */}
            {placement === "right" && (
              <div className="absolute top-10 -left-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-neutral-gray" />
            )}
            {placement === "left" && (
              <div className="absolute top-6 -right-2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-l-8 border-l-neutral-gray" />
            )}
            {placement === "top" && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
            )}
            {placement === "bottom" && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-white" />
            )}
          </div>,
          document.body
        )}
    </>
  );
}
