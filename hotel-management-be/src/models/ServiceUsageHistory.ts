import type { ServiceUsage } from "./ServiceUsage.js";
import type { User } from "./User.js";

export type ServiceUsageHistoryStatus = 'Pending' | 'In_Progress' | 'Completed' | 'Cancelled';

export type ServiceUsageHistory = {
  id: string;
  code: string;                              // MaLSDV
  serviceUsageId: string;                    // SuDungDichVu (ID)
  serviceUsage?: ServiceUsage | undefined;   // SuDungDichVu (Object)
  oldStatus?: ServiceUsageHistoryStatus | undefined;      // TrangThaiCu
  newStatus: ServiceUsageHistoryStatus;      // TrangThaiMoi
  changedAt: Date;                           // ThoiGian
  userId?: string | undefined;               // TaiKhoan (ID)
  user?: User | undefined;                   // TaiKhoan (Object)
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
