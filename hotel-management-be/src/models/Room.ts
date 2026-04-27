import { type RoomType } from "./RoomType.js";

export type RoomStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved' | 'Cleaning';

export type Room = {
  id: string;
  code: string; // MaPhong (Business Code)
  roomTypeId: string; // LoaiPhong (ID)
  roomType?: RoomType | undefined; // LoaiPhong (Object)
  price: number; // GiaPhong
  status: RoomStatus;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
