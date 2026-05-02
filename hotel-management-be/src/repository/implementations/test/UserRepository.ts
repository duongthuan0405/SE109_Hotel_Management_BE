import { type IUserRepository } from "../../types/IUserRepository.js";
import { type User } from "../../../models/User.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const mockPasswordHash = bcrypt.hashSync("123456", 10);

// Định nghĩa các ID cố định để các Repository khác có thể tham chiếu (Seed Data)
export const SEED_USER_ID_ADMIN = "550e8400-e29b-41d4-a716-446655440000";
export const SEED_USER_ID_CUSTOMER = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

const mockUsers: User[] = [
  {
    id: SEED_USER_ID_ADMIN,
    username: "admin",
    passwordHash: mockPasswordHash,
    role: "Admin",
  },
  {
    id: SEED_USER_ID_CUSTOMER,
    username: "customer1",
    passwordHash: mockPasswordHash,
    role: "Customer",
  },
];

const userRepository: IUserRepository = {
  findAll: async (): Promise<User[]> => {
    return mockUsers;
  },
  findById: async (id: string): Promise<User | null> => {
    const user = mockUsers.find((u) => u.id === id);
    return user || null;
  },
  findByUsername: async (username: string): Promise<User | null> => {
    const user = mockUsers.find((u) => u.username === username);
    return user || null;
  },
  create: async (user: Omit<User, "id">): Promise<User> => {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
    };
    mockUsers.push(newUser);
    return newUser;
  },
  save: async (user: User): Promise<User> => {
    const index = mockUsers.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      mockUsers[index] = user;
    }
    return user;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const index = mockUsers.findIndex((u) => u.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
      return true;
    }
    return false;
  },
};

export default userRepository;
