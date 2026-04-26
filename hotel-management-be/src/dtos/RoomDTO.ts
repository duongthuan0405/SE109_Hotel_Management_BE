import type { RoomStatus } from "../models/Room.js";

export type RoomResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type RoomDataDTO = {
  _id: string;
  MaPhong: string;
  LoaiPhong: string; // ID of RoomType
  GiaPhong: number;
  TrangThai: RoomStatus;
};

export type CreateRoomRequestDTO = {
  MaPhong: string;
  LoaiPhong: string;
  GiaPhong: number;
  TrangThai: RoomStatus;
};

export type UpdateRoomRequestDTO = {
  MaPhong?: string;
  LoaiPhong?: string;
  GiaPhong?: number;
  TrangThai?: RoomStatus;
};
