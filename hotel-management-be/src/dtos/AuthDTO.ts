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
  HoTen?: string;
  CMND?: string;
  SDT?: string;
  Email?: string;
  DiaChi?: string;
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
  otp?: string;
};

export type ResetPasswordRequestDTO = {
  Email: string;
  OTP: string;
  MatKhau: string;
};

export type ResetPasswordResponseDTO = {
  message: string;
};
