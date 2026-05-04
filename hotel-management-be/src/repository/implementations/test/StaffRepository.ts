import { type Staff } from "../../../models/Staff.js";
import { type IStaffRepository, type StaffInclude } from "../../types/IStaffRepository.js";
import userRepository, { SEED_USER_ID_ADMIN } from "./UserRepository.js";
import crypto from "crypto";

const mockStaffs: Staff[] = [
  {
    id: "f47ac10b-58cc-4372-a567-0e02b2c3d479", // UUID chuẩn cho Admin Staff
    code: "NV001",
    fullName: "Admin Staff",
    position: "Manager",
    phone: "0999999999",
    email: "admin@hotel.com",
    userId: SEED_USER_ID_ADMIN,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const applyInclude = async (staff: Staff, include?: StaffInclude): Promise<Staff> => {
  if (!include) return { ...staff };
  const result = { ...staff };
  if (include.user && staff.userId) {
    result.user = (await userRepository.findById(staff.userId)) || undefined;
  }
  return result;
};

const staffRepository: IStaffRepository = {
  findAll: async (include?: StaffInclude): Promise<Staff[]> => {
    return Promise.all(mockStaffs.map((s) => applyInclude(s, include)));
  },
  findById: async (id: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = mockStaffs.find((s) => s.id === id);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  findByUserId: async (userId: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = mockStaffs.find((s) => s.userId === userId);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  findByCode: async (code: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = mockStaffs.find((s) => s.code === code);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  findByEmail: async (email: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = mockStaffs.find((s) => s.email === email);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  create: async (staff: Omit<Staff, "id" | "createdAt" | "updatedAt" | "user" | "code"> & { code?: string | undefined }): Promise<Staff> => {
    const code = staff.code || (await staffRepository.generateNextCode());
    const newStaff: Staff = {
      ...staff,
      code,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStaffs.push(newStaff);
    return { ...newStaff };
  },
  update: async (id: string, data: Partial<Staff>, include?: StaffInclude): Promise<Staff | null> => {
    const index = mockStaffs.findIndex((s) => s.id === id);
    if (index === -1) return null;
    mockStaffs[index] = { ...mockStaffs[index]!, ...data, updatedAt: new Date() } as Staff;
    return applyInclude(mockStaffs[index]!, include);
  },
  delete: async (id: string): Promise<boolean> => {
    const index = mockStaffs.findIndex((s) => s.id === id);
    if (index !== -1) {
      mockStaffs.splice(index, 1);
      return true;
    }
    return false;
  },
  generateNextCode: async (): Promise<string> => {
    const nextNum = mockStaffs.length + 1;
    return `NV${nextNum.toString().padStart(3, "0")}`;
  },
};


export default staffRepository;
