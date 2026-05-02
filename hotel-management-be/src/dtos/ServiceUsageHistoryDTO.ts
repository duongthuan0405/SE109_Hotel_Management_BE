import type { ServiceUsageHistoryStatus } from "../models/ServiceUsageHistory.js";

export type ServiceUsageHistoryResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type ServiceUsageHistoryDataDTO = {
  _id: string;
  MaLSDV: string;
  SuDungDichVu: any;           // Populated or ID
  TrangThaiCu: ServiceUsageHistoryStatus;
  TrangThaiMoi: ServiceUsageHistoryStatus;
  ThoiGian: Date;
  TaiKhoan: any;               // Populated or ID
};

export type CreateServiceUsageHistoryRequestDTO = {
  MaLSDV: string;
  SuDungDichVu: string;
  TrangThaiCu: ServiceUsageHistoryStatus;
  TrangThaiMoi: ServiceUsageHistoryStatus;
  TaiKhoan?: string | undefined;
};

export type UpdateServiceUsageHistoryRequestDTO = {
  TrangThaiMoi: ServiceUsageHistoryStatus;
};
