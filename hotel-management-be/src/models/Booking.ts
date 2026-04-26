export type BookingDetail = {
  id?: string | undefined;
  code: string; // MaCTDP
  roomId: string; // Phong
};

export type Booking = {
  id: string; // _id
  code: string; // MaDatPhong
  customerId?: string | undefined; // KhachHang
  roomClass: string; // HangPhong
  startDate: Date; // NgayDen
  endDate: Date; // NgayDi
  guestCount: number; // SoKhach
  deposit: number; // TienCoc
  details: BookingDetail[]; // ChiTietDatPhong
  status: "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled" | "NoShow"; // TrangThai
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
