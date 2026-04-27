import { type RentalSlip } from "../models/RentalSlip.js";

// Request DTOs (Tiếng Việt để khớp với client cũ)
export type CreateRentalReceiptRequestDTO = {
  MaPTP?: string;
  DatPhong: string;
  Phong: string;
  NgayTraDuKien: string; // ISO String
  SoKhachThucTe: number;
  DonGiaSauDieuChinh: number;
  NhanVienCheckIn: string;
};

export type UpdateRentalReceiptRequestDTO = {
  NgayTraDuKien?: string;
  SoKhachThucTe?: number;
  DonGiaSauDieuChinh?: number;
  TrangThai?: string;
};

// Response DTOs
export type RentalReceiptResponseDTO = {
  success: boolean;
  message: string;
  data: RentalSlip;
};

export type RentalReceiptListResponseDTO = {
  success: boolean;
  message: string;
  data: RentalSlip[];
};
