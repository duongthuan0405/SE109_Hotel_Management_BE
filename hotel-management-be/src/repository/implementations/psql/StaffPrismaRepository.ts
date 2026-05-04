import { type Staff } from "../../../models/Staff.js";
import { type IStaffRepository, type StaffInclude } from "../../types/IStaffRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (staff: any): Staff => ({
  id: staff.id,
  userId: staff.userId,
  code: staff.code,
  fullName: staff.fullName,
  position: staff.position,
  phone: staff.phone,
  email: staff.email,
  createdAt: staff.createdAt,
  updatedAt: staff.updatedAt,
  user: staff.user ? {
    id: staff.user.id,
    username: staff.user.username,
    passwordHash: staff.user.passwordHash,
    role: staff.user.role,
  } : undefined,
});

const staffPrismaRepository: IStaffRepository = {
  findAll: async (include?: StaffInclude): Promise<Staff[]> => {
    const staffs = await prisma.staff.findMany({
      include: {
        user: include?.user || false,
      },
    });
    return staffs.map(mapToEntity);
  },

  findById: async (id: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = await prisma.staff.findUnique({
      where: { id },
      include: {
        user: include?.user || false,
      },
    });
    return staff ? mapToEntity(staff) : null;
  },

  findByUserId: async (userId: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = await prisma.staff.findUnique({
      where: { userId },
      include: {
        user: include?.user || false,
      },
    });
    return staff ? mapToEntity(staff) : null;
  },

  findByCode: async (code: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = await prisma.staff.findUnique({
      where: { code },
      include: {
        user: include?.user || false,
      },
    });
    return staff ? mapToEntity(staff) : null;
  },

  findByEmail: async (email: string, include?: StaffInclude): Promise<Staff | null> => {
    const staff = await prisma.staff.findFirst({
      where: { email },
      include: {
        user: include?.user || false,
      },
    });
    return staff ? mapToEntity(staff) : null;
  },

  create: async (staff: Omit<Staff, "id" | "createdAt" | "updatedAt" | "user" | "code"> & { code?: string | undefined }): Promise<Staff> => {
    const code = staff.code || (await staffPrismaRepository.generateNextCode());
    const newStaff = await prisma.staff.create({
      data: {
        userId: staff.userId,
        code,
        fullName: staff.fullName,
        position: staff.position,
        phone: staff.phone,
        email: staff.email,
      },
      include: {
        user: true,
      }
    });
    return mapToEntity(newStaff);
  },

  update: async (id: string, data: Partial<Omit<Staff, "user">>, include?: StaffInclude): Promise<Staff | null> => {
    const updateData: any = {};
    if (data.fullName !== undefined) updateData.fullName = data.fullName;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.userId !== undefined) updateData.userId = data.userId;

    const updated = await prisma.staff.update({
      where: { id },
      data: updateData,
      include: {
        user: include?.user || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.staff.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.staff.count();
    return `NV${(count + 1).toString().padStart(3, "0")}`;
  },
};

export default staffPrismaRepository;
