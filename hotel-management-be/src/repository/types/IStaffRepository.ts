import { type Staff } from "../../models/Staff.js";

export interface IStaffRepository {
  findAll(): Promise<Staff[]>;
  findById(id: string): Promise<Staff | null>;
  findByUserId(userId: string): Promise<Staff | null>;
  findByEmail(email: string): Promise<Staff | null>;
  create(staff: Omit<Staff, "id" | "createdAt" | "updatedAt">): Promise<Staff>;
  update(id: string, staff: Partial<Staff>): Promise<Staff | null>;
  delete(id: string): Promise<boolean>;
  generateNextId(): Promise<string>; // Sinh MaNV (NV001...)
}
