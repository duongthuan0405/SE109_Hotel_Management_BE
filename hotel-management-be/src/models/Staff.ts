import { type User } from "./User.js";

export type Staff = {
  id: string;
  userId: string;       // TaiKhoan (ID)
  user?: User | undefined; // TaiKhoan (Object)
  code: string;      // MaNV
  fullName: string;     // HoTen
  position: string;     // ChucVu
  phone: string;        // SDT
  email: string;        // Email
  createdAt: Date;
  updatedAt: Date;
};
