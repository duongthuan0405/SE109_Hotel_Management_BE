import { type Booking } from "./Booking.js";
import { type User } from "./User.js";

export type BookingStatusValue = "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled" | "NoShow";

export type BookingHistory = {
  id: string; // _id
  code: string; // MaLSDP
  bookingId: string; // DatPhong (ID)
  booking?: Booking | undefined; // DatPhong (Object)
  oldStatus: BookingStatusValue; // TrangThaiCu
  newStatus: BookingStatusValue; // TrangThaiMoi
  changedAt: Date; // ThoiGian
  userId?: string | undefined; // TaiKhoan (ID)
  user?: User | undefined; // TaiKhoan (Object)
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
