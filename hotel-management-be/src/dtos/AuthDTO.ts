export type LoginRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
};

export type LoginResponseDTO = {
  token: string;
  VaiTro: string;
};
