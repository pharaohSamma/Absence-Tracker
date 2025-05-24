import { User } from "./user";

export interface LoginResponse {
  lastName: string;
  firstName: string;
  token: string;
  user?: User;
  type?: string;
  id?: number;
  username?: string;
  email?: string;
  role?: string;
}
