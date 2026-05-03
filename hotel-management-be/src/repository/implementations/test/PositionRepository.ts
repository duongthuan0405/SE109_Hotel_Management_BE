import { type IPositionRepository } from "../../types/IPositionRepository.js";
import { type Position } from "../../../models/Position.js";
import crypto from "crypto";

let positions: Position[] = [
  {
    id: "pos-1",
    code: "CV001",
    name: "Quản lý",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pos-2",
    code: "CV002",
    name: "Tiếp tân",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const positionRepositoryImpl: IPositionRepository = {
  findAll: async (): Promise<Position[]> => {
    return [...positions];
  },

  findById: async (id: string): Promise<Position | null> => {
    const position = positions.find((p) => p.id === id);
    return position ? { ...position } : null;
  },

  findByCode: async (code: string): Promise<Position | null> => {
    const position = positions.find((p) => p.code === code);
    return position ? { ...position } : null;
  },

  create: async (data: Omit<Position, "id" | "code" | "createdAt" | "updatedAt">): Promise<Position> => {
    const maxNum = positions.reduce((max, p) => {
      const match = p.code.match(/^CV(\d+)$/);
      if (match) {
        const num = parseInt(match[1]!);
        return num > max ? num : max;
      }
      return max;
    }, 0);
    const finalCode = `CV${(maxNum + 1).toString().padStart(3, "0")}`;

    const newPosition: Position = {
      ...data,
      code: finalCode,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    positions.push(newPosition);
    return { ...newPosition };
  },

  update: async (id: string, data: Partial<Omit<Position, "id" | "code" | "createdAt" | "updatedAt">>): Promise<Position | null> => {
    const index = positions.findIndex((p) => p.id === id);
    if (index === -1) return null;

    positions[index] = {
      ...positions[index],
      ...data,
      updatedAt: new Date(),
    } as Position;
    return { ...positions[index] };
  },

  delete: async (id: string): Promise<boolean> => {
    const initialLength = positions.length;
    positions = positions.filter((p) => p.id !== id);
    return positions.length < initialLength;
  },
};

export default positionRepositoryImpl;
