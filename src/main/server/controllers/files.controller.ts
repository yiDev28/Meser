import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { app } from "electron";

const IMAGES_DIR = path.join(app.getPath("userData"), "images-app");

export async function getImagesApp(req: Request, res: Response) {
  try {
    const { filename } = req.params;

    if (!filename) {
      return res.status(400).json({ error: "Filename requerido" });
    }

    const filePath = path.join(IMAGES_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).end();
    }

    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({
      error: "Error al obtener imagen",
      details: error instanceof Error ? error.message : error,
    });
  }
}
