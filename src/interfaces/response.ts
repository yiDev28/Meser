export interface RESPONSE<T = unknown> {
  code: number; // Código de estado o respuesta
  msg: string; // Mensaje descriptivo
  data?: T | null | undefined; // Datos de cualquier tipo o nulos
}

export function NEW_RESPONSE<T = unknown>(
  code: number,
  msg: string,
  data?: T | null
): RESPONSE<T> {
  return { code, msg, data };
}
