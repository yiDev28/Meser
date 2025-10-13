export interface UserInterface {
  userId: number;
  username: string;
  role: string;
  token?: string | null;
}

export interface TokenPayload {
  id: string;
  username: string;
  role: string;
}
