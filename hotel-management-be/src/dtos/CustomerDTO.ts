export type CustomerResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type CustomerDataDTO = {
  _id: string;
  MaKH: string;
  HoTen: string;
  CMND: string;
  SDT: string;
  Email: string;
  DiaChi?: string | undefined;
  TaiKhoan?: any | undefined;
};

export type CreateCustomerRequestDTO = {
  HoTen: string;
  CMND: string;
  SDT: string;
  Email: string;
  DiaChi?: string | undefined;
  TaiKhoanId?: string | undefined;
};

export type UpdateCustomerRequestDTO = {
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
};
