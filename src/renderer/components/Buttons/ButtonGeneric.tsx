import { IconBaseProps } from "react-icons/lib";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  mode?: string;
  size?: string;
  label: string;
  iconPosition?: "left" | "right";
  icon?: React.FC<IconBaseProps>;
  onClick?: () => void;
}

export function ButtonGeneric({
  type = "button",
  mode = "info",
  size = "md",
  label,
  iconPosition ="left",
  icon: Icon,
  onClick,
}: ButtonProps) {
  const typeClasses: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-white hover:bg-secondary/90",
    danger: "bg-red-500 text-white hover:bg-red-600",
    info: "bg-neutral-gray text-background hover:bg-neutral-dark hover:text-white",
    light: "bg-neutral-light text-neutral-dark  hover:bg-neutral-background",
  };

  const sizeClasses: Record<string, { button: string; icon: string }> = {
    sm: { button: "py-1 px-2 text-sm", icon: "w-4 h-4" },
    md: { button: "py-2 px-4", icon: "w-5 h-5" },
    lg: { button: "py-3 px-5 text-lg", icon: "w-6 h-6" },
    xl: { button: "py-4 px-6 text-xl", icon: "w-7 h-7" },
  };

  return (
    <button
      className={`cursor-pointer rounded-md flex items-center gap-2 ${typeClasses[mode]} ${sizeClasses[size].button}`}
      onClick={onClick}
      type={type}
    >
      {iconPosition === "left" && Icon && <Icon className={sizeClasses[size].icon} />}
      <span>{label}</span>
      {iconPosition === "right" && Icon && <Icon className={sizeClasses[size].icon} />}
    </button>
  );
}
