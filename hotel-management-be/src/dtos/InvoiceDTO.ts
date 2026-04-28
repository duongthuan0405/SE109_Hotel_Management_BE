export type InvoiceDetailDTO = {
  MaCTHD: string;
  TenHang: string;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
};

export type CreateInvoiceRequestDTO = {
  MaHD?: string;
  PhieuThuePhong: string;
  NhanVienThuNgan?: string;
  KhachHang?: string;
  PhuongThucThanhToan: string;
  TongTienPhong?: number;
  TongTienDichVu?: number;
  PhuThu?: number;
  TienBoiThuong?: number;
  TienDaCoc?: number;
  ChiTietHoaDon?: InvoiceDetailDTO[];
};

export type CreateCheckoutInvoiceRequestDTO = {
  PhieuThuePhong: string;
  NhanVienThuNgan?: string;
  KhachHang?: string;
  PhuongThucThanhToan: string;
  TongTienPhong?: number;
  PhuThu?: number;
  TienBoiThuong?: number;
  TienDaCoc?: number;
};

export type InvoiceDataDTO = {
  _id: string;
  MaHD: string;
  PhieuThuePhong: any;
  NhanVienThuNgan: any;
  KhachHang: any;
  NgayLap: Date;
  TongTienPhong: number;
  TongTienDichVu: number;
  PhuThu: number;
  TienBoiThuong: number;
  TienDaCoc: number;
  TongThanhToan: number;
  PhuongThucThanhToan: any;
  TrangThaiThanhToan: string;
  ChiTietHoaDon: InvoiceDetailDTO[];
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};

export type PreviewInvoiceResponseDTO = {
  KhachHang?: string;
  HoTenKhachHang?: string;
  TongTienPhong: number;
  TongTienDichVu: number;
  TienDaCoc: number;
  PhieuThuePhong: string;
};
