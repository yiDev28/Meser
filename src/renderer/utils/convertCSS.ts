
export function resolveCssVar(color: string): string {
  if (color.startsWith("var(")) {
    const varName = color.slice(4, -1).trim(); // extrae --color-success
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  }
  return color;
}

// Convierte un hex (#RRGGBB) a rgba con transparencia
export function hexToRgba(hex: string, alpha: number = 0.2): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
