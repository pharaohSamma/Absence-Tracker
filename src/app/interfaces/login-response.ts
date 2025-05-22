import { User } from "./user";

export interface LoginResponse {
  token: string;
  user?: User;
  type?: string;
  id?: number;
  username?: string;
  email?: string;
  role?: string;
}
