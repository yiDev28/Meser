interface CardGenericProps {
  title?: React.ReactNode;
  body?: React.ReactNode;
  onClick?: () => void;
  mode?:
    | "primary"
    | "secondary"
    | "customStyle"
    | "info"
    | "success"
    | "danger"
    | "warning";
  size?: "sm" | "md" | "lg" | "xl";
  isSelected?: boolean;
  customStyle?: React.CSSProperties;
  alignItems?: "start" | "center" | "end";
}

export function CardGeneric({
  title,
  body,
  onClick,
  mode = "info",
  size = "md",
  isSelected = false,
  customStyle,
  alignItems = "start",
}: CardGenericProps) {
  const typeClasses: Record<
    string,
    {
      bg: string;
      border: string;
      textTitle: string;
      textBody: string;
      isSelected: string;
    }
  > = {
    primary: {
      bg: "bg-primary/20",
      border: "border border-primary/40",
      textTitle: "text-primary",
      textBody: "text-primary",
      isSelected: "ring-1 ring-primary bg-primary/10 shadow-lg",
    },
    secondary: {
      bg: "bg-secondary/20",
      border: "border border-secondary/40",
      textTitle: "text-secondary",
      textBody: "text-secondary",
      isSelected: "ring-1 ring-secondary bg-secondary/10 shadow-lg",
    },
    success: {
      bg: "bg-success/20",
      border: "border border-success/40",
      textTitle: "text-success",
      textBody: "text-success",
      isSelected: "ring-1 ring-success bg-success/10 shadow-lg",
    },
    info: {
      bg: "bg-info/20",
      border: "border border-info/40",
      textTitle: "text-info",
      textBody: "text-info",
      isSelected: "ring-1 ring-info bg-info/10 shadow-lg",
    },
    warning: {
      bg: "bg-warning/20",
      border: "border border-warning/40",
      textTitle: "text-warning",
      textBody: "text-warning",
      isSelected: "ring-1 ring-warning bg-warning/10 shadow-lg",
    },
    danger: {
      bg: "bg-error/20",
      border: "border border-error/40",
      textTitle: "text-error",
      textBody: "text-error",
      isSelected: "ring-1 ring-error bg-error/10 shadow-lg",
    },
    customStyle: {
      bg: "",
      border: "border border-neutral-gray/40",
      textTitle: "",
      textBody: "",
      isSelected: "ring-1 ring-neutral-gray/40 bg-neutral-gray/10 shadow-lg",
    },
  };

  const sizeClasses: Record<
    string,
    { spacing: string; textTitle: string; textBody: string }
  > = {
    sm: {
      spacing: "py-1.5 px-4 ",
      textTitle: "text-sm font-semibold ",
      textBody: "text-lg font-bold",
    },
    md: {
      spacing: "py-3 px-6 ",
      textTitle: "text-md font-semibold ",
      textBody: "text-xl font-bold",
    },
  };
  return (
    <div
      className={`${
        isSelected ? typeClasses[mode].isSelected : typeClasses[mode].bg
      } 
      ${typeClasses[mode].border}
        ${sizeClasses[size].spacing} rounded-lg  p-4 
        ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      style={customStyle}
    >
      {title && (
        <div
          className={`flex
          ${
            alignItems === "center"
              ? "items-center justify-center"
              : alignItems === "end"
                ? "items-end justify-end"
                : "items-start justify-start"
          } 
            ${typeClasses[mode].textTitle} ${sizeClasses[size].textTitle} gap-2 `}
          style={customStyle}
        >
          {title}
        </div>
      )}
      {body && (
        <div
          className={`flex
            ${typeClasses[mode].textBody}
           ${sizeClasses[size].textBody}
           ${
             alignItems === "center"
               ? "items-center justify-center"
               : alignItems === "end"
                 ? "items-end justify-end mr-3"
                 : "items-start justify-start ml-3"
           }
           `}
          style={customStyle}
        >
          {body}
        </div>
      )}
    </div>
  );
}
