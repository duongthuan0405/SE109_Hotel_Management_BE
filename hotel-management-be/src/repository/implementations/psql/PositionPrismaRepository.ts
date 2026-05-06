import { type Position } from "../../../models/Position.js";
import { type IPositionRepository } from "../../types/IPositionRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (p: any): Position => ({
  id: p.id,
  code: p.code,
  name: p.name,
  createdAt: p.createdAt,
  updatedAt: p.updatedAt,
});

const positionPrismaRepository: IPositionRepository = {
  findAll: async (): Promise<Position[]> => {
    const records = await prisma.position.findMany();
    return records.map(mapToEntity);
  },

  findById: async (id: string): Promise<Position | null> => {
    const record = await prisma.position.findUnique({
      where: { id },
    });
    return record ? mapToEntity(record) : null;
  },

  findByCode: async (code: string): Promise<Position | null> => {
    const record = await prisma.position.findUnique({
      where: { code },
    });
    return record ? mapToEntity(record) : null;
  },

  create: async (data: Omit<Position, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Position> => {
    const count = await prisma.position.count();
    const code = `CV${(count + 1).toString().padStart(3, "0")}`;
    const newRecord = await prisma.position.create({
      data: {
        code,
        name: data.name,
      },
    });
    return mapToEntity(newRecord);
  },

  update: async (id: string, data: Partial<Omit<Position, 'id' | 'code' | 'createdAt' | 'updatedAt'>>): Promise<Position | null> => {
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;

    const updated = await prisma.position.update({
      where: { id },
      data: updateData,
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.position.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

export default positionPrismaRepository;
