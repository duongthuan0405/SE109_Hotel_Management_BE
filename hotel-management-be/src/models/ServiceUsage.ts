import { type RentalSlip } from "./RentalSlip.js";
import { type Service } from "./Service.js";

export type ServiceUsageStatus = 'Pending' | 'In_Progress' | 'Completed' | 'Cancelled';

export type ServiceUsage = {
  id: string;
  code: string; // MaSDDV
  rentalSlipId: string; // PhieuThuePhong (ID)
  rentalSlip?: RentalSlip | undefined; // PhieuThuePhong (Object)
  serviceId: string; // DichVu (ID)
  service?: Service | undefined; // DichVu (Object)
  quantity: number; // SoLuong
  unitPrice: number; // DonGia
  totalAmount: number; // ThanhTien
  requestedAt: Date; // ThoiDiemYeuCau
  status: ServiceUsageStatus; // TrangThai
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
