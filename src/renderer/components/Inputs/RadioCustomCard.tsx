import React from "react";
import { IconBaseProps } from "react-icons/lib";

interface RadioCustomProps {
  value: string | number;
  name: string;
  id: string;
  icon?: React.FC<IconBaseProps>;
  iconPosition?: "left" | "right";
  label?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  size?: "sm" | "md" | "lg" | "xl";
}

export function RadioCustomCard({
  value,
  name,
  id,
  icon: Icon,
  label,
  onChange,
  checked,
  size = "md",
  iconPosition = "left",
}: RadioCustomProps) {
  const sizeClasses: Record<string, { input: string; icon: string }> = {
    sm: { input: "py-0.5 px-1 text-sm", icon: "w-4 h-4" },
    md: { input: "py-1 px-2", icon: "w-5 h-5" },
    lg: { input: "py-2 px-4 text-lg", icon: "w-6 h-6" },
    xl: { input: "py-4 px-6 text-xl", icon: "w-7 h-7" },
  };
  return (
    <label>
      <input
        type="radio"
        value={value}
        className="peer hidden"
        name={name}
        id={id}
        onChange={onChange}
        checked={checked}
      />
      <div className="hover:bg-neutral-gray/20 flex items-center justify-between border-2 rounded-lg cursor-pointer  border-neutral-gray/50 group peer-checked:border-primary px-3 transition-colors duration-300">
        {iconPosition === "left" && Icon && (
          <Icon className={sizeClasses[size].icon} />
        )}
        <h2
          className={`${sizeClasses[size].input} font-medium text-neutral-dark group-[.peer:checked+&]:text-secondary`}
        >
          {label}
        </h2>
        {iconPosition === "right" && Icon && (
          <Icon className={sizeClasses[size].icon} />
        )}
      </div>
    </label>
  );
}
