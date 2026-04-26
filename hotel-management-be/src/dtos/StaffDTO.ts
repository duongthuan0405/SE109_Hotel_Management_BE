export type StaffResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type StaffDataDTO = {
  _id: string;
  TaiKhoanId: string;
  MaNV: string;
  HoTen: string;
  ChucVu: string;
  SDT: string;
  Email: string;
};

export type CreateStaffRequestDTO = {
  TaiKhoanId: string;
  HoTen: string;
  ChucVu: string;
  SDT: string;
  Email: string;
};

export type UpdateStaffRequestDTO = {
  HoTen?: string | undefined;
  ChucVu?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
};
