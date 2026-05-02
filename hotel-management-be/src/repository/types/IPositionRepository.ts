import type { Position } from "../../models/Position.js";

export interface IPositionRepository {
  findAll(): Promise<Position[]>;
  findById(id: string): Promise<Position | null>;
  findByCode(code: string): Promise<Position | null>;
  create(data: Omit<Position, 'id' | 'createdAt' | 'updatedAt'>): Promise<Position>;
  update(id: string, data: Partial<Omit<Position, 'id' | 'code' | 'createdAt' | 'updatedAt'>>): Promise<Position | null>;
  delete(id: string): Promise<boolean>;
}
