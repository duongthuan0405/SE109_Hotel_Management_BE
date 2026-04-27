import { type User } from "./User.js";

export type Customer = {
  id: string;
  userId?: string | undefined; // TaiKhoan (ID)
  user?: User | undefined;     // TaiKhoan (Object)
  customerId: string;          // MaKH (ví dụ: KH001)
  fullName: string;            // HoTen
  identityCard: string;        // CMND
  phone: string;               // SDT
  email: string;               // Email
  address?: string | undefined; // DiaChi
  createdAt: Date;
  updatedAt: Date;
};
