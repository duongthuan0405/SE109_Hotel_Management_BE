import { type User } from "../../models/User.js";

export type IUserRepository = {
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(user: Omit<User, "id">): Promise<User>;
  save(user: User): Promise<User>;
};
