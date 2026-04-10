import { IconBaseProps } from "react-icons/lib";

interface TexTareaGenericProps {
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  id?: string;
  icon?: React.FC<IconBaseProps>;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  size?: "sm" | "md" | "lg";
  maxLength?: number;
  error?: string;
  hidden?: boolean;
  disabled?: boolean;
}

export function TexTareaGeneric({
  label,
  placeholder = "",
  value = "",
  name = "",
  id = "",
  icon: Icon,
  onChange,
  required = true,
  size = "md",
  maxLength,
  error,
  hidden = false,
  disabled = false,
}: TexTareaGenericProps) {
  
  const sizeClasses: Record<string, { input: string; icon: string }> = {
    sm: { input: "py-1 text-sm", icon: "w-4 h-4" },
    md: { input: "py-2 ", icon: "w-5 h-5" },
    lg: { input: "py-3 text-lg ", icon: "w-6 h-6" },
    xl: { input: "py-4 text-xl ", icon: "w-7 h-7" },
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block mb-1 text-neutral-dark/80 text-sm font-semibold">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          {Icon && (
            <Icon className={`${sizeClasses[size].icon} text-neutral-gray`} />
          )}
        </span>
        <textarea
          className={`
            block p-2.5
            w-full  bg-transparent placeholder:text-neutral-gray 
            text-neutral-dark border border-neutral-gray rounded 
            transition duration-300 ease focus:outline-none focus:border-secondary
            focus:shadow-lg 
            ${sizeClasses[size].input} 
            ${Icon ? "pl-12 pr-3 " : "px-3 "}`}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          hidden={hidden}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
        ></textarea>

      </div>
      {error && <p className="mt-1 text-xs text-error">{error}</p>}
    </div>
  );
}
