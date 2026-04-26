export type Customer = {
  id: string;
  userId?: string | undefined; // ID tài khoản liên kết (nếu có)
  customerId: string;          // MaKH (ví dụ: KH001)
  fullName: string;            // HoTen
  identityCard: string;        // CMND
  phone: string;               // SDT
  email: string;               // Email
  address?: string | undefined; // DiaChi
  createdAt: Date;
  updatedAt: Date;
};
