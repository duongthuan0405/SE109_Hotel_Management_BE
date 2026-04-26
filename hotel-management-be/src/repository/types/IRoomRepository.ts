import type { Room, RoomStatus } from "../../models/Room.js";

export interface IRoomRepository {
  create(room: Omit<Room, "id" | "createdAt" | "updatedAt">): Promise<Room>;
  findById(id: string): Promise<Room | null>;
  findByRoomNumber(roomNumber: string): Promise<Room | null>;
  findAll(): Promise<Room[]>;
  update(id: string, room: Partial<Omit<Room, "id" | "createdAt" | "updatedAt">>): Promise<Room | null>;
  updateStatus(id: string, status: RoomStatus): Promise<Room | null>;
  delete(id: string): Promise<boolean>;
  findByRoomType(roomTypeId: string): Promise<Room[]>;
}
