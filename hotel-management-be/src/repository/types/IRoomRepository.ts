import type { Room, RoomStatus } from "../../models/Room.js";

export type RoomInclude = {
  roomType?: boolean;
};

export interface IRoomRepository {
  create(room: Omit<Room, "id" | "createdAt" | "updatedAt" | "roomType">): Promise<Room>;
  findById(id: string, include?: RoomInclude): Promise<Room | null>;
  findByCode(code: string, include?: RoomInclude): Promise<Room | null>;
  findAll(include?: RoomInclude): Promise<Room[]>;
  update(id: string, room: Partial<Omit<Room, "id" | "createdAt" | "updatedAt" | "roomType">>, include?: RoomInclude): Promise<Room | null>;
  updateStatus(id: string, status: RoomStatus, include?: RoomInclude): Promise<Room | null>;
  delete(id: string): Promise<boolean>;
  findByRoomType(roomTypeId: string, include?: RoomInclude): Promise<Room[]>;
}
