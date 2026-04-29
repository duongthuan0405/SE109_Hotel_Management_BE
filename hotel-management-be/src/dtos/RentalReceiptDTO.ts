import { type RentalSlip } from "../models/RentalSlip.js";

// Request DTOs (Tiếng Việt để khớp với client cũ)
export type CreateRentalReceiptRequestDTO = {
  DatPhong: string;
  Phong: string;
  NgayTraDuKien: string; // ISO String
  SoKhachThucTe: number;
  DonGiaSauDieuChinh: number;
};

export type UpdateRentalReceiptRequestDTO = {
  NgayTraDuKien?: string;
  SoKhachThucTe?: number;
  DonGiaSauDieuChinh?: number;
  TrangThai?: string;
};

// Response DTOs
export type RentalReceiptDataDTO = {
  _id: string;
  MaPTP: string;
  DatPhong: any; // Populated Booking or ID
  Phong: any; // Populated Room or ID
  NgayNhanPhong: Date;
  NgayTraDuKien: Date;
  SoKhachThucTe: number;
  DonGiaSauDieuChinh: number;
  NhanVienCheckIn: any; // Populated Staff or ID
  TrangThai: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

export type RentalReceiptResponseDTO = {
  success: boolean;
  message: string;
  data: RentalReceiptDataDTO;
};

export type RentalReceiptListResponseDTO = {
  success: boolean;
  message: string;
  data: RentalReceiptDataDTO[];
};
