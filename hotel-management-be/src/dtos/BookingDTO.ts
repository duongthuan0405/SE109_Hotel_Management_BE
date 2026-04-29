export type BookingResponseWrapper<T> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type CreateBookingDetailDTO = {
  Phong: string; // ID của phòng
};

export type BookingDetailDTO = {
  _id?: string | undefined;
  MaCTDP: string;
  Phong: any; 
};

export type BookingDataDTO = {
  _id: string;
  MaDatPhong: string;
  KhachHang: any; 
  HangPhong: string;
  NgayDen: Date;
  NgayDi: Date;
  SoKhach: number;
  TienCoc: number;
  ChiTietDatPhong: BookingDetailDTO[];
  TrangThai: string;
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
};

export type CreateBookingRequestDTO = {
  KhachHang?: string | undefined; 
  HangPhong: string;
  NgayDen: string;
  NgayDi: string;
  SoKhach: number;
  TienCoc?: number | undefined;
  ChiTietDatPhong?: CreateBookingDetailDTO[] | undefined;
};

export type UpdateBookingRequestDTO = {
  HangPhong?: string | undefined;
  NgayDen?: string | undefined;
  NgayDi?: string | undefined;
  SoKhach?: number | undefined;
  TienCoc?: number | undefined;
  ChiTietDatPhong?: CreateBookingDetailDTO[] | undefined;
  TrangThai?: string | undefined;
};
