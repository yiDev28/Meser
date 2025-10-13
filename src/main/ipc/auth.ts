import { ipcMain } from "electron";
import { RESPONSE } from "../../interfaces/response";
import { LoginUser } from "../../interfaces/app";
import { UserInterface } from "../../interfaces/user";
import { authUser, meToken } from "../services/application/authService";

ipcMain.handle(
  "login-user",
  async (_event, data: LoginUser): Promise<RESPONSE<UserInterface>> => {
    return await authUser(data);
  }
);

ipcMain.handle(
  "me",
  async (_event, token: string): Promise<RESPONSE<unknown>> => {
    return await meToken(token);
  }
);
