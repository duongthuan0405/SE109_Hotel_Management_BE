import { type IStaffRepository } from "../types/IStaffRepository.js";
import { type Staff } from "../../models/Staff.js";

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

const staffRepository: IStaffRepository = {
  findAll: async (): Promise<Staff[]> => {
    return mockStaffs;
  },
  findById: async (id: string): Promise<Staff | null> => {
    return mockStaffs.find(s => s.id === id) || null;
  },
  findByUserId: async (userId: string): Promise<Staff | null> => {
    return mockStaffs.find(s => s.userId === userId) || null;
  },
  findByEmail: async (email: string): Promise<Staff | null> => {
    return mockStaffs.find(s => s.email === email) || null;
  },
  create: async (staff: Omit<Staff, "id" | "createdAt" | "updatedAt">): Promise<Staff> => {
    const newStaff: Staff = {
      ...staff,
      id: `staff-${mockStaffs.length + 1}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockStaffs.push(newStaff);
    return newStaff;
  },
  update: async (id: string, data: Partial<Staff>): Promise<Staff | null> => {
    const index = mockStaffs.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const current = mockStaffs[index]!;
    const updatedStaff: Staff = {
      id: current.id,
      userId: data.userId !== undefined ? data.userId : current.userId,
      staffId: data.staffId !== undefined ? data.staffId : current.staffId,
      fullName: data.fullName !== undefined ? data.fullName : current.fullName,
      position: data.position !== undefined ? data.position : current.position,
      phone: data.phone !== undefined ? data.phone : current.phone,
      email: data.email !== undefined ? data.email : current.email,
      createdAt: current.createdAt,
      updatedAt: new Date(),
    };
    
    mockStaffs[index] = updatedStaff;
    return updatedStaff;
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
