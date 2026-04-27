import { type IStaffRepository, type StaffInclude } from "../types/IStaffRepository.js";
import { type Staff } from "../../models/Staff.js";
import userRepository from "./UserRepository.js";

const mockStaffs: Staff[] = [
  {
    id: "staff-1",
    userId: "user-1", // admin account
    staffId: "NV001",
    fullName: "Hệ thống Admin",
    position: "Admin",
    phone: "0999999999",
    email: "admin@hotel.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  }
];

const applyInclude = async (staff: Staff, include?: StaffInclude): Promise<Staff> => {
  if (!include) return { ...staff };

  const result = { ...staff };

  if (include.user) {
    result.user = (await userRepository.findById(staff.userId)) || undefined;
  }

  return result;
};

const staffRepository: IStaffRepository = {
  findAll: async (include): Promise<Staff[]> => {
    return Promise.all(mockStaffs.map(s => applyInclude(s, include)));
  },
  findById: async (id, include): Promise<Staff | null> => {
    const staff = mockStaffs.find(s => s.id === id);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  findByUserId: async (userId, include): Promise<Staff | null> => {
    const staff = mockStaffs.find(s => s.userId === userId);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  findByEmail: async (email, include): Promise<Staff | null> => {
    const staff = mockStaffs.find(s => s.email === email);
    if (!staff) return null;
    return applyInclude(staff, include);
  },
  create: async (staff: Omit<Staff, "id" | "createdAt" | "updatedAt" | "user">): Promise<Staff> => {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${mockStaffs.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStaffs.push(newStaff);
    return newStaff;
  },
  update: async (id, data, include): Promise<Staff | null> => {
    const index = mockStaffs.findIndex(s => s.id === id);
    if (index === -1) return null;
    const current = mockStaffs[index]!;
    const updatedStaff: Staff = {
      ...current,
      ...data,
      updatedAt: new Date(),
    } as Staff;
    
    mockStaffs[index] = updatedStaff;
    return applyInclude(updatedStaff, include);
  },
  delete: async (id: string): Promise<boolean> => {
    const index = mockStaffs.findIndex(s => s.id === id);
    if (index === -1) return false;
    mockStaffs.splice(index, 1);
    return true;
  },
  generateNextId: async (): Promise<string> => {
    const count = mockStaffs.length + 1;
    return `NV${count.toString().padStart(3, "0")}`;
  }
};

export default staffRepository;
