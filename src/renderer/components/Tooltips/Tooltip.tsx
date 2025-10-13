import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

export function Tooltip({ text, position = "top", children }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      let top = rect.top;
      let left = rect.left + rect.width / 2;

      if (position === "top") top = rect.top - 35;
      if (position === "bottom") top = rect.bottom + 5;
      if (position === "left") left = rect.left - 10;
      if (position === "right") left = rect.right + 10;

      setCoords({ top, left });
    }
  }, [open, position]);

  return (
    <span
      ref={ref}
      className="relative cursor-pointer"
      onClick={() => setOpen(!open)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {children}

      {open &&
        createPortal(
          <div
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-50 px-3 py-1 text-xs text-white bg-black rounded shadow-md transform -translate-x-1/2"
          >
            {text}
          </div>,
          document.body
        )}
    </span>
  );
}
