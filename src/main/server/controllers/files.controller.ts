import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { app } from "electron";

const IMAGES_BASE_DIR = path.join(app.getPath("userData"), "images");

export async function getImagesApp(req: Request, res: Response) {
  try {
    const { filename } = req.params;

    if (!filename || Array.isArray(filename)) {
      return res.status(400).json({ error: "Filename requerido" });
    }

    const filePath = path.join(IMAGES_BASE_DIR, filename);

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

export async function getImagesByFolder(req: Request, res: Response) {
  try {
    const { folder, filename } = req.params;

    if (!folder || !filename || Array.isArray(folder) || Array.isArray(filename)) {
      return res.status(400).json({ error: "Folder y filename requeridos" });
    }

    const filePath = path.join(IMAGES_BASE_DIR, folder, filename);

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
