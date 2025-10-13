export function formatTo12Hour(date: Date | string): string {
  // Si viene como string desde SQLite/Sequelize, conviértelo a Date
  const d = typeof date === "string" ? new Date(date) : date;

  let hours = d.getHours();
  const minutes = d.getMinutes();
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  hours = hours ? hours : 12; // el 0 se convierte en 12

  const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

export function getElapsedTime(startDate: string): string {
  const start = new Date(startDate).getTime();
  const now = Date.now();
  let diff = Math.floor((now - start) / 1000); // segundos totales

  const hours = Math.floor(diff / 3600);
  diff %= 3600;
  const minutes = Math.floor(diff / 60);
  const seconds = diff % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  }

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}