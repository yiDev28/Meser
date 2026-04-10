import { LoginUser } from "../../../interfaces/app";
import { UserInterface } from "../../../interfaces/user";
import { NEW_RESPONSE, RESPONSE } from "../../../interfaces/response";
import User from "../../models/User/UserModel";
import bcrypt from "bcryptjs";
import { generateToken, verifyToken } from "../../utils/jwtUtil";
import { getErrorMessage } from "../../../utils/errorUtils";

export async function authUser(
  data: LoginUser
): Promise<RESPONSE<UserInterface>> {
  try {
    const user = await User.findOne({
      where: {
        username: data.userClient,
      },
    });

    if (!user) {
      return NEW_RESPONSE(1, `Usuario ${data.userClient} no encontrado.`);
    }

    const match = await bcrypt.compare(
      data.passClient,
      user.dataValues.password
    );

    if (!match) {
      return NEW_RESPONSE(1, "Contraseña incorrecta");
    }

    const token = generateToken({
      id: user.dataValues.id,
      username: user.dataValues.username,
      role: user.dataValues.role,
    });
console.log(user.dataValues.id)
    return NEW_RESPONSE(0, "Inicio de sesión exitoso", {
      userId:user.dataValues.id,
      username: user.dataValues.username,
      role: user.dataValues.role,
      token,
    });
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error inesperado al iniciar sesión: " + getErrorMessage(error)
    );
  }
}

export async function meToken(token: string): Promise<RESPONSE<unknown>> {
  try {
    const payload = verifyToken(token);
    if (!payload) {
      return NEW_RESPONSE(
        1,
        "Su sesión ha expirado, por favor inicie sesión nuevamente."
      );
    }

    return NEW_RESPONSE(0, "Token válido", payload);
  } catch (error) {
    return NEW_RESPONSE(
      -1,
      "Error al verificar token:" + getErrorMessage(error)
    );
  }
}
