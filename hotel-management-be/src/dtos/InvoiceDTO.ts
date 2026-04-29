export type CreateInvoiceDetailDTO = {
  TenHang: string;
  SoLuong: number;
  DonGia: number;
  ThanhTien: number;
};

export type InvoiceDetailDTO = CreateInvoiceDetailDTO & {
  MaCTHD: string;
};

export type CreateInvoiceRequestDTO = {
  PhieuThuePhong: string;
  KhachHang?: string;
  PhuongThucThanhToan: string;
  TongTienPhong?: number;
  TongTienDichVu?: number;
  PhuThu?: number;
  TienBoiThuong?: number;
  TienDaCoc?: number;
  ChiTietHoaDon?: CreateInvoiceDetailDTO[];
};

export type CreateCheckoutInvoiceRequestDTO = {
  PhieuThuePhong: string;
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
