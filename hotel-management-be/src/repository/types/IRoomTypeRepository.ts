import { type RoomType } from "../../models/RoomType.js";

export type IRoomTypeRepository = {
  findAll(): Promise<RoomType[]>;
  findById(id: string): Promise<RoomType | null>;
  findByCode(code: string): Promise<RoomType | null>;
  create(roomType: Omit<RoomType, "id">): Promise<RoomType>;
  save(roomType: RoomType): Promise<RoomType>;
  deleteById(id: string): Promise<boolean>;
};
