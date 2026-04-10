import { hexToRgba, resolveCssVar } from "@/renderer/utils/convertCSS";

interface BadgeProps {
  color: string;
  text: string;
}

export function BadgesDefault({ text, color }: BadgeProps) {
  const resolvedColor = resolveCssVar(color);

  return (
    <span
      className="px-3 py-1 rounded-full font-bold text-sm"
      style={{
        color: resolvedColor,
        backgroundColor: hexToRgba(resolvedColor, 0.2), 
      }}
    >
      {text}
    </span>
  );
}
