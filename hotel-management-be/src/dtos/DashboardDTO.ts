export interface DashboardSummaryDTO {
  TongDoanhThu: number;
  TongDatPhong: number;
  TongKhachHang: number;
  LuotThueDangHoatDong: number;
}

export interface RevenueStatDTO {
  Ngay: string;
  SoTien: number;
}

export interface RoomOccupancyStatDTO {
  TrangThai: string;
  SoLuong: number;
}

export interface TopServiceStatDTO {
  TenDichVu: string;
  SoLuotDung: number;
  DoanhThu: number;
}

export interface DashboardDataDTO {
  TongQuan: DashboardSummaryDTO;
  ThongKeDoanhThu: RevenueStatDTO[];
  MatDoPhong: RoomOccupancyStatDTO[];
  TopDichVu: TopServiceStatDTO[];
}
