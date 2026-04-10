import { RESPONSE } from "@/interfaces/response";

import { app } from "electron";
import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const IMAGES_BASE_FOLDER = "images";

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

export async function createUrlFileByFolder(
  folder: string,
  fileName: string
): Promise<RESPONSE<string>> {
  const urlPath = `${IMAGES_BASE_FOLDER}/${folder}/${fileName}`;
  return createUrlFile(urlPath);
}

export async function downloadAndSaveImage(
  url: string,
  folderName: string,
  fileName: string
): Promise<RESPONSE<string>> {
  const baseDir = path.join(app.getPath("userData"), IMAGES_BASE_FOLDER, folderName);

  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  const filePath = path.join(baseDir, fileName);

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    https
      .get(url, (response: any) => {
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
        fs.unlink(filePath, () => reject(err));
      });
  });
}

export async function downloadAndSaveFile(
  url: string,
  folderName: string,
  fileName: string
): Promise<RESPONSE<string>> {
  return downloadAndSaveImage(url, folderName, fileName);
}

export function getImageLocalPath(folderName: string, fileName: string): string {
  return path.join(app.getPath("userData"), IMAGES_BASE_FOLDER, folderName, fileName);
}

export const FOLDER_NAMES = {
  CLIENT_LOGOS: "client-logos",
  CATEGORIES_IMAGES: "categories-images",
  PRODUCTS_IMAGES: "products-images",
} as const;

export async function downloadAndSaveImageUrl(
  remoteUrl: string,
  folderName: string,
  fileName: string
): Promise<RESPONSE<string>> {
  try {
    const downloadResult = await downloadAndSaveImage(remoteUrl, folderName, fileName);
    
    if (downloadResult.code !== 0) {
      return {
        code: downloadResult.code,
        msg: downloadResult.msg,
        data: "",
      };
    }

    const urlResult = await createUrlFileByFolder(folderName, fileName);
    
    return {
      code: urlResult.code,
      msg: urlResult.msg,
      data: urlResult.data || "",
    };
  } catch (error) {
    return {
      code: -1,
      msg: error instanceof Error ? error.message : "Error desconocido",
      data: "",
    };
  }
}
