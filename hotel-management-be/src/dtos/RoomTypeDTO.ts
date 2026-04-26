import { type RoomType } from "../models/RoomType.js";

export type RoomTypeResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type RoomTypeDataDTO = RoomType;

export type CreateRoomTypeRequestDTO = {
  MaLoaiPhong: string;
  TenLoaiPhong: string;
};

export type UpdateRoomTypeRequestDTO = {
  MaLoaiPhong?: string;
  TenLoaiPhong?: string;
};
