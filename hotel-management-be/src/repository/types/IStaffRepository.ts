import { type Staff } from "../../models/Staff.js";

export type StaffInclude = {
  user?: boolean;
};

export interface IStaffRepository {
  findAll(include?: StaffInclude): Promise<Staff[]>;
  findById(id: string, include?: StaffInclude): Promise<Staff | null>;
  findByUserId(userId: string, include?: StaffInclude): Promise<Staff | null>;
  findByCode(code: string, include?: StaffInclude): Promise<Staff | null>;
  findByEmail(email: string, include?: StaffInclude): Promise<Staff | null>;
  create(staff: Omit<Staff, "id" | "createdAt" | "updatedAt" | "user" | "code"> & { code?: string | undefined }): Promise<Staff>;
  update(id: string, staff: Partial<Omit<Staff, "user">>, include?: StaffInclude): Promise<Staff | null>;
  delete(id: string): Promise<boolean>;
  generateNextCode(): Promise<string>;
}
