// Request DTOs (field tiếng Việt, tương thích client cũ)

export type CreateServiceUsageRequestDTO = {
  PhieuThuePhong: string; // ID phiếu thuê phòng
  DichVu: string; // ID dịch vụ
  SoLuong: number;
  NgaySDV?: string; // ISO String, optional
  DonGia: number;
  ThanhTien: number;
};

export type UpdateServiceUsageRequestDTO = {
  SoLuong?: number;
  TrangThai?: string;
};

// Response DTOs

export type ServiceUsageDataDTO = {
  _id: string;
  MaSDDV: string;
  PhieuThuePhong: any; // Populated RentalSlip hoặc ID
  DichVu: any; // Populated Service hoặc ID
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
  ThoiDiemYeuCau: Date;
  TrangThai: string;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

export type ServiceUsageResponseDTO = {
  success: boolean;
  message: string;
  data: ServiceUsageDataDTO;
};

export type ServiceUsageListResponseDTO = {
  success: boolean;
  message: string;
  data: ServiceUsageDataDTO[];
};
