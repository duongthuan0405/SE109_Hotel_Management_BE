import { type User } from "@/models/User.js";

export type IUserRepository = {
  findByUsername(username: string): Promise<User | null>;
};
