import { type RoomType } from "../../../models/RoomType.js";
import { type IRoomTypeRepository } from "../../types/IRoomTypeRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (rt: any): RoomType => ({
  id: rt.id,
  code: rt.code,
  name: rt.name,
  price: rt.price,
  maxOccupancy: rt.maxOccupancy,
});

const roomTypePrismaRepository: IRoomTypeRepository = {
  findAll: async (): Promise<RoomType[]> => {
    const rts = await prisma.roomType.findMany();
    return rts.map(mapToEntity);
  },

  findById: async (id: string): Promise<RoomType | null> => {
    const rt = await prisma.roomType.findUnique({
      where: { id },
    });
    return rt ? mapToEntity(rt) : null;
  },

  findByCode: async (code: string): Promise<RoomType | null> => {
    const rt = await prisma.roomType.findUnique({
      where: { code },
    });
    return rt ? mapToEntity(rt) : null;
  },

  create: async (roomType: Omit<RoomType, "id" | "code"> & { code?: string | undefined }): Promise<RoomType> => {
    const code = roomType.code || (await roomTypePrismaRepository.generateNextCode());
    const newRt = await prisma.roomType.create({
      data: {
        code,
        name: roomType.name,
        price: roomType.price,
        maxOccupancy: roomType.maxOccupancy,
      },
    });
    return mapToEntity(newRt);
  },

  save: async (roomType: RoomType): Promise<RoomType> => {
    const saved = await prisma.roomType.upsert({
      where: { id: roomType.id },
      update: {
        name: roomType.name,
        price: roomType.price,
        maxOccupancy: roomType.maxOccupancy,
      },
      create: {
        id: roomType.id,
        code: roomType.code,
        name: roomType.name,
        price: roomType.price,
        maxOccupancy: roomType.maxOccupancy,
      },
    });
    return mapToEntity(saved);
  },

  deleteById: async (id: string): Promise<boolean> => {
    try {
      await prisma.roomType.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.roomType.count();
    return `LP${(count + 1).toString().padStart(2, "0")}`;
  },
};

export default roomTypePrismaRepository;
