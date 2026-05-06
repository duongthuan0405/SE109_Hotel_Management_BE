import { type Maintenance } from "../../../models/Maintenance.js";
import { type IMaintenanceRepository, type MaintenanceInclude } from "../../types/IMaintenanceRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (m: any): Maintenance => ({
  id: m.id,
  code: m.code,
  roomId: m.roomId,
  room: m.room ? {
    id: m.room.id,
    code: m.room.code,
    roomTypeId: m.room.roomTypeId,
    price: m.room.price,
    status: m.room.status,
    createdAt: m.room.createdAt,
    updatedAt: m.room.updatedAt,
  } : undefined,
  customerId: m.customerId || undefined,
  customer: m.customer ? {
    id: m.customer.id,
    code: m.customer.code,
    fullName: m.customer.fullName,
    identityCard: m.customer.identityCard,
    phone: m.customer.phone,
    email: m.customer.email || undefined,
    address: m.customer.address || undefined,
    userId: m.customer.userId || undefined,
    createdAt: m.customer.createdAt,
    updatedAt: m.customer.updatedAt,
  } : undefined,
  technicianId: m.technicianId || undefined,
  technician: m.technician ? {
    id: m.technician.id,
    userId: m.technician.userId,
    code: m.technician.code,
    fullName: m.technician.fullName,
    position: m.technician.position,
    phone: m.technician.phone,
    email: m.technician.email,
    createdAt: m.technician.createdAt,
    updatedAt: m.technician.updatedAt,
  } : undefined,
  content: m.content,
  startDate: m.startDate,
  endDate: m.endDate,
  status: m.status as Maintenance["status"],
  createdAt: m.createdAt,
  updatedAt: m.updatedAt,
});

const maintenancePrismaRepository: IMaintenanceRepository = {
  findAll: async (include?: MaintenanceInclude): Promise<Maintenance[]> => {
    const records = await prisma.maintenance.findMany({
      include: {
        room: include?.room || false,
        customer: include?.customer || false,
        technician: include?.technician || false,
      },
    });
    return records.map(mapToEntity);
  },

  findById: async (id: string, include?: MaintenanceInclude): Promise<Maintenance | null> => {
    const record = await prisma.maintenance.findUnique({
      where: { id },
      include: {
        room: include?.room || false,
        customer: include?.customer || false,
        technician: include?.technician || false,
      },
    });
    return record ? mapToEntity(record) : null;
  },

  findByCustomerId: async (customerId: string, include?: MaintenanceInclude): Promise<Maintenance[]> => {
    const records = await prisma.maintenance.findMany({
      where: { customerId },
      include: {
        room: include?.room || false,
        customer: include?.customer || false,
        technician: include?.technician || false,
      },
    });
    return records.map(mapToEntity);
  },

  create: async (data: Omit<Maintenance, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'room' | 'customer' | 'technician'>): Promise<Maintenance> => {
    const code = await maintenancePrismaRepository.getNextCode();
    const newRecord = await prisma.maintenance.create({
      data: {
        code,
        roomId: data.roomId,
        customerId: data.customerId || null,
        technicianId: data.technicianId || null,
        content: data.content,
        startDate: data.startDate,
        endDate: data.endDate,
        status: data.status,
      },
    });
    return mapToEntity(newRecord);
  },

  update: async (id: string, data: Partial<Omit<Maintenance, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'room' | 'customer' | 'technician'>>, include?: MaintenanceInclude): Promise<Maintenance | null> => {
    const updateData: any = {};
    if (data.roomId !== undefined) updateData.roomId = data.roomId;
    if (data.customerId !== undefined) updateData.customerId = data.customerId;
    if (data.technicianId !== undefined) updateData.technicianId = data.technicianId;
    if (data.content !== undefined) updateData.content = data.content;
    if (data.startDate !== undefined) updateData.startDate = data.startDate;
    if (data.endDate !== undefined) updateData.endDate = data.endDate;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.maintenance.update({
      where: { id },
      data: updateData,
      include: {
        room: include?.room || false,
        customer: include?.customer || false,
        technician: include?.technician || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.maintenance.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  getNextCode: async (): Promise<string> => {
    const count = await prisma.maintenance.count();
    return `PBT${(count + 1).toString().padStart(4, "0")}`;
  },
};

export default maintenancePrismaRepository;
