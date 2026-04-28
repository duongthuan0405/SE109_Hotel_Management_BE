// Request DTOs
export type CreateBookingHistoryRequestDTO = {
  MaLSDP: string;
  DatPhong: string;
  TrangThaiCu: string;
  TrangThaiMoi: string;
  TaiKhoan?: string | undefined;
};

// Response DTOs
export type BookingHistoryDataDTO = {
  _id: string;
  MaLSDP: string;
  DatPhong: any; // Populated Booking or ID
  TrangThaiCu: string;
  TrangThaiMoi: string;
  ThoiGian: Date;
  TaiKhoan: any; // Populated User or ID
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

export type BookingHistoryResponseDTO = {
  success: boolean;
  message: string;
  data: BookingHistoryDataDTO;
};

export type BookingHistoryListResponseDTO = {
  success: boolean;
  message: string;
  data: BookingHistoryDataDTO[];
};
