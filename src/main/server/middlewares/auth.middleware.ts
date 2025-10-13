import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token requerido" });

  try {
    //const decoded = jwt.verify(token, SECRET);
    //(req as any).user = decoded; // para usar después si quieres
    next();
  } catch (err) {
    return res.status(403).json({ error: "Token inválido" });
  }
}