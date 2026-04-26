import { type User } from "../models/User.js";

export type AccountResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type AccountDataDTO = Omit<User, "passwordHash"> & {
  fullName?: string | undefined;
  identityCard?: string | undefined;
  phone?: string | undefined;
  email?: string | undefined;
  address?: string | undefined;
};

export type CreateAccountRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
};

export type UpdateAccountRequestDTO = {
  HoTen?: string | undefined;
  CMND?: string | undefined;
  SDT?: string | undefined;
  Email?: string | undefined;
  DiaChi?: string | undefined;
  VaiTro?: string | undefined;
};

export type ChangePasswordRequestDTO = {
  MatKhauCu: string;
  MatKhauMoi: string;
};
