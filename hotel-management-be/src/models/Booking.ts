import { type Customer } from "./Customer.js";
import { type Room } from "./Room.js";

export type BookingDetail = {
  id?: string | undefined;
  code: string; // MaCTDP
  roomId: string; // Phong (ID)
  room?: Room | undefined; // Phong (Object)
};

export type Booking = {
  id: string; // _id
  code: string; // MaDatPhong
  customerId?: string | undefined; // KhachHang (ID)
  customer?: Customer | undefined; // KhachHang (Object)
  roomClass: string; // HangPhong
  startDate: Date; // NgayDen
  endDate: Date; // NgayDi
  guestCount: number; // SoKhach
  deposit: number; // TienCoc
  totalAmount: number; // TongTien
  details: BookingDetail[]; // ChiTietDatPhong
  status: "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled" | "NoShow"; // TrangThai
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
