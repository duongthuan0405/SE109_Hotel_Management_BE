import { type IPositionRepository } from "../types/IPositionRepository.js";
import { type Position } from "../../models/Position.js";
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
    name: "Lễ tân",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pos-3",
    code: "CV003",
    name: "Kế toán",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "pos-4",
    code: "CV004",
    name: "Buồng phòng",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const positionRepository: IPositionRepository = {
  findAll: async (): Promise<Position[]> => {
    return positions.map((p) => ({ ...p }));
  },

  findById: async (id): Promise<Position | null> => {
    const position = positions.find((p) => p.id === id);
    return position ? { ...position } : null;
  },

  findByCode: async (code): Promise<Position | null> => {
    const position = positions.find((p) => p.code === code);
    return position ? { ...position } : null;
  },

  create: async (data): Promise<Position> => {
    const newPosition: Position = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    positions.push(newPosition);
    return { ...newPosition };
  },

  update: async (id, data): Promise<Position | null> => {
    const index = positions.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const current = positions[index]!;
    const updated: Position = {
      ...current,
      ...data,
      updatedAt: new Date(),
    } as Position;

    positions[index] = updated;
    return { ...updated };
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = positions.length;
    positions = positions.filter((p) => p.id !== id);
    return positions.length < initialLength;
  },
};

export default positionRepository;
