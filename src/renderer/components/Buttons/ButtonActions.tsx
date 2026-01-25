import { IconBaseProps } from "react-icons/lib";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  mode?: string;
  size?: string;
  label?: string;
  icon?: React.FC<IconBaseProps>;
  onClick?: () => void;
}

// Botomes tipo accion cuadrados con icono y texto ideal sin label
export function ButtonActions({
  type = "button",
  mode = "info",
  size = "md",
  label,
  icon: Icon,
  onClick,
}: ButtonProps) {
  const typeClasses: Record<string, string> = {
    light: "bg-background text-neutral-gray outline hover:bg-neutral-gray hover:text-neutral-light",
    primary: "bg-primary text-neutral-light hover:bg-primary/80",
    quaternary: "bg-quaternary text-neutral-light hover:bg-quaternary/90",
    quaternary_light: "bg-background text-quaternary outline hover:text-neutral-light hover:bg-quaternary/90",
    success: "bg-success text-neutral-light hover:bg-success/85",
    warning: "bg-warning text-neutral-light hover:bg-warning/85",
    danger: "bg-error text-neutral-light hover:bg-error/85",
    info: "bg-neutral-gray text-neutral-dark hover:bg-neutral-dark hover:text-white",
  };

  const sizeClasses: Record<string, { button: string; icon: string }> = {
    sm: { button: "py-1 px-1 text-sm", icon: "w-4 h-4" },
    md: { button: "py-2 px-2", icon: "w-5 h-5" },
    lg: { button: "py-2.5 px-2.5 text-lg", icon: "w-6 h-6" },
    xl: { button: "py-4 px-4 text-xl", icon: "w-7 h-7" },
  };

  return (
    <button
      className={`cursor-pointer rounded-md flex items-center gap-2 ${typeClasses[mode]} ${sizeClasses[size].button}`}
      onClick={onClick}
      type={type}
    >
      {Icon && <Icon className={sizeClasses[size].icon} />}
      {label && <span>{label}</span>}
    </button>
  );
}
