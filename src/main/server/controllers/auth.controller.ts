import { Request, Response } from "express";
import { authUser } from "../../services/application/authService";

export async function loginHandler(req: Request, res: Response) {
  const { userClient, passClient } = req.body;

  const user = await authUser({
    idClient: "1", // este valor debería venir de la base de datos
    userClient,
    passClient,
  });

  if (user.code !== 0) {
    return res.status(401).json(user);
  }

  return res.json(user);
}
