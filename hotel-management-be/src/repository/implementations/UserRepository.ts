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
      id: `user-${mockUsers.length + 1}`,
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
