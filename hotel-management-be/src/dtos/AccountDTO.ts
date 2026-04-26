import { type User } from "../models/User.js";

export type AccountResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type AccountDataDTO = Omit<User, "passwordHash"> & {
  fullName?: string;
  identityCard?: string;
  phone?: string;
  email?: string;
  address?: string;
};

export type CreateAccountRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
};

export type UpdateAccountRequestDTO = {
  HoTen?: string;
  CMND?: string;
  SDT?: string;
  Email?: string;
  DiaChi?: string;
  VaiTro?: string;
};

export type ChangePasswordRequestDTO = {
  MatKhauCu: string;
  MatKhauMoi: string;
};
