import { type RoomType } from "../models/RoomType.js";

export type RoomTypeResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type RoomTypeDataDTO = {
  _id: string;
  MaLoaiPhong: string;
  TenLoaiPhong: string;
  DonGia: number;
  SoKhachToiDa: number;
};

export type CreateRoomTypeRequestDTO = {
  TenLoaiPhong: string;
  DonGia: number;
  SoKhachToiDa: number;
};

export type UpdateRoomTypeRequestDTO = {
  MaLoaiPhong?: string | undefined;
  TenLoaiPhong?: string | undefined;
  DonGia?: number | undefined;
  SoKhachToiDa?: number | undefined;
};
