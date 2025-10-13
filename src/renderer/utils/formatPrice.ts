export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0, // sin decimales
    maximumFractionDigits: 0,
  })
    .format(value)
    .replace("COP", "") // quitamos el "COP"
    .trim();
}
