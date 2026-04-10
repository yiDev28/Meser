export function formatCurrency(value: number| string): string {
  value = typeof value === "string" ? parseFloat(value) : value;
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

export const formatTimeHourMin = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
