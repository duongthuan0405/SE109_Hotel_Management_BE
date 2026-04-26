export type RentalSlipStatus = 'CheckedIn' | 'CheckedOut';

export type RentalSlip = {
  id: string;
  slipCode: string; // MaPTP
  bookingId: string; // DatPhong
  roomId: string; // Phong
  checkInDate: Date; // NgayNhanPhong
  expectedCheckOutDate: Date; // NgayTraDuKien
  actualGuestCount: number; // SoKhachThucTe
  adjustedPrice: number; // DonGiaSauDieuChinh
  checkInStaffId: string; // NhanVienCheckIn
  status: RentalSlipStatus;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};
