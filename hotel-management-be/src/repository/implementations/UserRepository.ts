import { type IUserRepository } from "../types/IUserRepository.js";
import { type User } from "../../models/User.js";
import bcrypt from "bcryptjs";

const mockPasswordHash = bcrypt.hashSync("123456", 10);

const mockUsers: User[] = [
  {
    id: "user-1",
    username: "admin",
    passwordHash: mockPasswordHash,
    role: "Admin",
  },
  {
    id: "user-2",
    username: "customer1",
    passwordHash: mockPasswordHash,
    role: "Customer",
  },
];

const userRepository: IUserRepository = {
  findByUsername: async (username: string): Promise<User | null> => {
    const user = mockUsers.find((u) => u.username === username);
    return user || null;
  },
};

export default userRepository;
