import jwt from "jsonwebtoken";
import { TokenPayload } from "../../interfaces/user";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const EXPIRES_IN = "24h";

export function generateToken(payload: TokenPayload) {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: EXPIRES_IN });
  } catch (error) {
    return null;
  }
}

export function verifyToken(token: string){
  try {
    return jwt.verify(token, JWT_SECRET as string);
  } catch (err) {
    return null;
  }
}
