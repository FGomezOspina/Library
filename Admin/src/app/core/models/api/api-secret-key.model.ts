import { User } from "@models/account/user.model";

export interface ApiSecretKey {
  id: string;
  key: string;
  user: User;
  createdAt: string;
}
