// Request DTO (field tiếng Việt, tương thích client cũ)
export type UpdateSettingsRequestDTO = {
  ThongTinKhachSan?: {
    Ten?: string;
    DiaChi?: string;
    SDT?: string;
    Email?: string;
  };
  ThoiGian?: {
    GioNhanPhong?: string;
    GioTraPhong?: string;
  };
  ThuePhi?: {
    ThueVAT?: number;
    PhiDichVu?: number;
  };
  GiaPhongCoBan?: {
    Normal?: number;
    Standard?: number;
    Premium?: number;
    Luxury?: number;
  };
};

// Response DTO
export type SettingsDataDTO = {
  _id: string;
  Key: string;
  ThongTinKhachSan: {
    Ten: string;
    DiaChi: string;
    SDT: string;
    Email: string;
  };
  ThoiGian: {
    GioNhanPhong: string;
    GioTraPhong: string;
  };
  ThuePhi: {
    ThueVAT: number;
    PhiDichVu: number;
  };
  GiaPhongCoBan: {
    Normal: number;
    Standard: number;
    Premium: number;
    Luxury: number;
  };
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
};
