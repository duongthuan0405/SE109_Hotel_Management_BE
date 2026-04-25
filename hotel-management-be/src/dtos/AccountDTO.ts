import { type User } from "../models/User.js";

export type AccountResponseWrapper<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export type AccountDataDTO = Omit<User, "passwordHash">;

export type CreateAccountRequestDTO = {
  TenDangNhap: string;
  MatKhau: string;
  VaiTro: string;
};

export type UpdateAccountRequestDTO = {
  VaiTro?: string;
};

export type ChangePasswordRequestDTO = {
  MatKhauCu: string;
  MatKhauMoi: string;
};
