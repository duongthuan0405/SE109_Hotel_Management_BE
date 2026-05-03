import { type Room } from "./Room.js";
import { type Customer } from "./Customer.js";
import { type Staff } from "./Staff.js";

export type MaintenanceStatus = 'Pending' | 'Completed' | 'Cancelled';

export type Maintenance = {
  id: string;
  code: string;                        // MaPBT (PBT001, PBT002, ...)
  roomId: string;                      // Phong (ID)
  room?: Room | undefined;             // Phong (Object)
  customerId?: string | undefined;     // KhachHang (ID) — optional, chỉ guest mới có
  customer?: Customer | undefined;     // KhachHang (Object)
  technicianId?: string | undefined;   // NVKyThuat (ID)
  technician?: Staff | undefined;      // NVKyThuat (Object)
  content: string;                     // NoiDung
  startDate: Date;                     // NgayThucHien
  endDate: Date;                       // NgayKetThuc
  status: MaintenanceStatus;           // TrangThai
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
