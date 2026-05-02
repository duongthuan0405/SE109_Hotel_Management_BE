import { type User } from "../../../models/User.js";
import { type IUserRepository } from "../../types/IUserRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (user: any): User => ({
  id: user.id,
  username: user.username,
  passwordHash: user.passwordHash,
  role: user.role,
});

const userPrismaRepository: IUserRepository = {
  findAll: async (): Promise<User[]> => {
    const users = await prisma.user.findMany();
    return users.map(mapToEntity);
  },

  findById: async (id: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user ? mapToEntity(user) : null;
  },

  findByUsername: async (username: string): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { username },
    });
    return user ? mapToEntity(user) : null;
  },

  create: async (user: Omit<User, "id">): Promise<User> => {
    const newUser = await prisma.user.create({
      data: {
        username: user.username,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
    return mapToEntity(newUser);
  },

  save: async (user: User): Promise<User> => {
    const savedUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        passwordHash: user.passwordHash,
        role: user.role,
      },
      create: {
        id: user.id,
        username: user.username,
        passwordHash: user.passwordHash,
        role: user.role,
      },
    });
    return mapToEntity(savedUser);
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

export default userPrismaRepository;
