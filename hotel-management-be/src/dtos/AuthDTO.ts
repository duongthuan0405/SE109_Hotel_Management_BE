export type LoginRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
};

export type LoginResponseDTO = {
  token: string;
  VaiTro: string;
};

export type RegisterRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
};

export type RegisterResponseDTO = {
  id: string;
  TenDangNhap: string;
  VaiTro: string;
};

export type ForgotPasswordRequestDTO = {
  Email: string;
};

export type ForgotPasswordResponseDTO = {
  message: string;
  otp?: string | undefined;
};

export type ResetPasswordRequestDTO = {
  Email: string;
  OTP: string;
  MatKhau: string;
};

export type ResetPasswordResponseDTO = {
  message: string;
};
