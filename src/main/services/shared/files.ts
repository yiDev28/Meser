import { RESPONSE } from "@/interfaces/response";

import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

export async function createUrlFile(
  urlPath: string
): Promise<RESPONSE<string>> {
  const baseApiUrl = process.env.BASE_API_URL || "";

  if (!baseApiUrl) {
    return {
      code: 1,
      msg: "BASE_API_URL no está definido en las variables de entorno",
      data: "",
    };
  }
  const fullUrl = `${baseApiUrl}/${urlPath}`;
  return {
    code: 0,
    msg: "URL creada con éxito",
    data: fullUrl,
  };
}
export async function downloadAndSaveFile(
  url: string,
  folderName: string,
  fileName: string
): Promise<RESPONSE<string>> {
  // Definir la ruta base: userData/nombre_carpeta
  const baseDir = path.join(app.getPath("userData"), folderName);

  // 2. Crear la carpeta si no existe (recursive: true evita errores si ya existe)
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const filePath = path.join(baseDir, fileName);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (response: any) => {
        // Verificar si la respuesta es exitosa (código 200)
        if (response.statusCode !== 200) {
          reject(
            new Error(`Fallo al descargar: Código ${response.statusCode}`)
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close();
          resolve({
            code: 0,
            msg: "Archivo descargado con éxito",
            data: filePath,
          });
        });
      })
      .on("error", (err: unknown) => {
        // Si hay error, eliminamos el archivo parcial creado
        fs.unlink(filePath, () => reject(err));
      });
  });
}
