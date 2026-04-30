import type { MaintenanceStatus } from "../models/Maintenance.js";

export type MaintenanceResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type MaintenanceDataDTO = {
  _id: string;
  MaPBT: string;
  Phong: any;          // Populated Room object or ID
  KhachHang?: any;     // Populated Customer object or ID
  NVKyThuat?: any;     // Populated Staff object or ID (HoTen only)
  NoiDung: string;
  NgayThucHien: Date;
  NgayKetThuc: Date;
  TrangThai: MaintenanceStatus;
};

// Staff tạo phiếu bảo trì
export type CreateMaintenanceRequestDTO = {
  MaPBT: string;
  Phong: string;
  NVKyThuat: string;
  NgayThucHien: string;
  NgayKetThuc: string;
  NoiDung: string;
};

// Staff cập nhật phiếu bảo trì
export type UpdateMaintenanceRequestDTO = {
  NoiDung?: string;
  NVKyThuat?: string;
  NgayThucHien?: string;
  NgayKetThuc?: string;
  TrangThai?: MaintenanceStatus;
};

// Guest gửi yêu cầu bảo trì
export type GuestCreateMaintenanceRequestDTO = {
  Phong: string;
  NoiDung: string;
};

// Response cho getNextCode
export type NextCodeResponseDTO = {
  success: boolean;
  nextCode: string;
};
