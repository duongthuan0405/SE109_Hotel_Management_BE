import { type User } from "../models/User.js";

export type AccountResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T | undefined;
  error?: string | undefined;
};

export type AccountDataDTO = {
  _id: string;
  TenDangNhap: string;
  VaiTro: string;
};

export type CreateAccountRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
};

export type UpdateAccountRequestDTO = {
  VaiTro?: string | undefined;
};

export type ChangePasswordRequestDTO = {
  MatKhauCu: string;
  MatKhauMoi: string;
};
