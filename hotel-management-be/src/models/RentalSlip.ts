import { type Booking } from "./Booking.js";
import { type Room } from "./Room.js";
import { type Staff } from "./Staff.js";

export type RentalSlipStatus = 'CheckedIn' | 'CheckedOut' | 'Cancelled';

export type RentalSlip = {
  id: string;
  code: string; // MaPTP (Business Code)
  bookingId: string; // DatPhong (ID)
  booking?: Booking | undefined; // DatPhong (Object)
  roomId: string; // Phong (ID)
  room?: Room | undefined; // Phong (Object)
  checkInDate: Date; // NgayNhanPhong
  expectedCheckOutDate: Date; // NgayTraDuKien
  adjustedPrice: number; // DonGiaSauDieuChinh
  checkInStaffId: string; // NhanVienCheckIn (ID)
  checkInStaff?: Staff | undefined; // NhanVienCheckIn (Object)
  status: RentalSlipStatus;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
