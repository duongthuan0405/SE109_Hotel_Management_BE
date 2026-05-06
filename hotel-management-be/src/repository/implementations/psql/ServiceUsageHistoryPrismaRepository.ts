import { type ServiceUsageHistory } from "../../../models/ServiceUsageHistory.js";
import { type IServiceUsageHistoryRepository, type ServiceUsageHistoryInclude } from "../../types/IServiceUsageHistoryRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (h: any): ServiceUsageHistory => ({
  id: h.id,
  code: h.code,
  serviceUsageId: h.serviceUsageId,
  serviceUsage: h.serviceUsage ? {
    id: h.serviceUsage.id,
    code: h.serviceUsage.code,
    rentalSlipId: h.serviceUsage.rentalSlipId,
    serviceId: h.serviceUsage.serviceId,
    quantity: h.serviceUsage.quantity,
    unitPrice: h.serviceUsage.unitPrice,
    totalAmount: h.serviceUsage.totalAmount,
    requestedAt: h.serviceUsage.requestedAt,
    status: h.serviceUsage.status,
    createdAt: h.serviceUsage.createdAt,
    updatedAt: h.serviceUsage.updatedAt,
  } : undefined,
  oldStatus: h.oldStatus || undefined,
  newStatus: h.newStatus as ServiceUsageHistory["newStatus"],
  changedAt: h.changedAt,
  userId: h.userId || undefined,
  user: h.user ? {
    id: h.user.id,
    username: h.user.username,
    passwordHash: h.user.passwordHash,
    role: h.user.role,
  } : undefined,
  createdAt: h.createdAt,
  updatedAt: h.updatedAt,
});

const serviceUsageHistoryPrismaRepository: IServiceUsageHistoryRepository = {
  findAll: async (include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory[]> => {
    const records = await prisma.serviceUsageHistory.findMany({
      include: {
        serviceUsage: include?.serviceUsage || false,
        user: include?.user || false,
      },
    });
    return records.map(mapToEntity);
  },

  findById: async (id: string, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory | null> => {
    const record = await prisma.serviceUsageHistory.findUnique({
      where: { id },
      include: {
        serviceUsage: include?.serviceUsage || false,
        user: include?.user || false,
      },
    });
    return record ? mapToEntity(record) : null;
  },

  findByServiceUsageId: async (serviceUsageId: string, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory[]> => {
    const records = await prisma.serviceUsageHistory.findMany({
      where: { serviceUsageId },
      include: {
        serviceUsage: include?.serviceUsage || false,
        user: include?.user || false,
      },
    });
    return records.map(mapToEntity);
  },

  findByCode: async (code: string): Promise<ServiceUsageHistory | null> => {
    const record = await prisma.serviceUsageHistory.findUnique({
      where: { code },
    });
    return record ? mapToEntity(record) : null;
  },

  create: async (data: Omit<ServiceUsageHistory, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'serviceUsage' | 'user'>): Promise<ServiceUsageHistory> => {
    const count = await prisma.serviceUsageHistory.count();
    const code = `LSDV${(count + 1).toString().padStart(4, "0")}`;
    const newRecord = await prisma.serviceUsageHistory.create({
      data: {
        code,
        serviceUsageId: data.serviceUsageId,
        oldStatus: data.oldStatus || null,
        newStatus: data.newStatus,
        userId: data.userId || null,
      },
    });
    return mapToEntity(newRecord);
  },

  update: async (id: string, data: Partial<Omit<ServiceUsageHistory, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'serviceUsage' | 'user'>>, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory | null> => {
    const updateData: any = {};
    if (data.serviceUsageId !== undefined) updateData.serviceUsageId = data.serviceUsageId;
    if (data.oldStatus !== undefined) updateData.oldStatus = data.oldStatus;
    if (data.newStatus !== undefined) updateData.newStatus = data.newStatus;
    if (data.userId !== undefined) updateData.userId = data.userId;

    const updated = await prisma.serviceUsageHistory.update({
      where: { id },
      data: updateData,
      include: {
        serviceUsage: include?.serviceUsage || false,
        user: include?.user || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.serviceUsageHistory.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

export default serviceUsageHistoryPrismaRepository;
