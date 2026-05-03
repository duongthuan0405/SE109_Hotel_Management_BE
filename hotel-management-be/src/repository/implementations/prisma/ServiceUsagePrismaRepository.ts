import { type ServiceUsage, type ServiceUsageStatus } from "../../../models/ServiceUsage.js";
import { type IServiceUsageRepository, type ServiceUsageInclude } from "../../types/IServiceUsageRepository.js";
import prisma from "../../../config/prisma.js";

const mapToEntity = (usage: any): ServiceUsage => ({
  id: usage.id,
  code: usage.code,
  rentalSlipId: usage.rentalSlipId,
  serviceId: usage.serviceId,
  quantity: usage.quantity,
  unitPrice: usage.unitPrice,
  totalAmount: usage.totalAmount,
  requestedAt: usage.requestedAt,
  status: usage.status as ServiceUsageStatus,
  createdAt: usage.createdAt,
  updatedAt: usage.updatedAt,
  service: usage.service ? {
    id: usage.service.id,
    code: usage.service.code,
    name: usage.service.name,
    price: usage.service.price,
  } : undefined,
  rentalSlip: usage.rentalSlip ? {
    id: usage.rentalSlip.id,
    code: usage.rentalSlip.code,
    bookingId: usage.rentalSlip.bookingId,
    roomId: usage.rentalSlip.roomId,
    checkInDate: usage.rentalSlip.checkInDate,
    expectedCheckOutDate: usage.rentalSlip.expectedCheckOutDate,
    actualGuestCount: usage.rentalSlip.actualGuestCount,
    adjustedPrice: usage.rentalSlip.adjustedPrice,
    checkInStaffId: usage.rentalSlip.checkInStaffId,
    status: usage.rentalSlip.status,
    createdAt: usage.rentalSlip.createdAt,
    updatedAt: usage.rentalSlip.updatedAt,
  } : undefined,
});

const serviceUsagePrismaRepository: IServiceUsageRepository = {
  create: async (data: Omit<ServiceUsage, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "service" | "code"> & { code?: string | undefined }): Promise<ServiceUsage> => {
    const code = data.code || (await serviceUsagePrismaRepository.generateNextCode());
    const newUsage = await prisma.serviceUsage.create({
      data: {
        code,
        rentalSlipId: data.rentalSlipId,
        serviceId: data.serviceId,
        quantity: data.quantity,
        unitPrice: data.unitPrice,
        totalAmount: data.totalAmount,
        status: data.status,
      },
      include: {
        service: true,
        rentalSlip: true,
      },
    });
    return mapToEntity(newUsage);
  },

  findById: async (id: string, include?: ServiceUsageInclude): Promise<ServiceUsage | null> => {
    const usage = await prisma.serviceUsage.findUnique({
      where: { id },
      include: {
        service: include?.service || false,
        rentalSlip: include?.rentalSlip || false,
      },
    });
    return usage ? mapToEntity(usage) : null;
  },

  findByCode: async (code: string): Promise<ServiceUsage | null> => {
    const usage = await prisma.serviceUsage.findUnique({
      where: { code },
      include: {
        service: true,
        rentalSlip: true,
      },
    });
    return usage ? mapToEntity(usage) : null;
  },

  findAll: async (include?: ServiceUsageInclude): Promise<ServiceUsage[]> => {
    const usages = await prisma.serviceUsage.findMany({
      include: {
        service: include?.service || false,
        rentalSlip: include?.rentalSlip || false,
      },
    });
    return usages.map(mapToEntity);
  },

  findByRentalSlipIds: async (ids: string[], include?: ServiceUsageInclude): Promise<ServiceUsage[]> => {
    const usages = await prisma.serviceUsage.findMany({
      where: { rentalSlipId: { in: ids } },
      include: {
        service: include?.service || false,
        rentalSlip: include?.rentalSlip || false,
      },
    });
    return usages.map(mapToEntity);
  },

  findByCustomerId: async (customerId: string, include?: ServiceUsageInclude): Promise<ServiceUsage[]> => {
    const usages = await prisma.serviceUsage.findMany({
      where: {
        rentalSlip: {
          booking: {
            customerId: customerId,
          },
        },
      },
      include: {
        service: include?.service || false,
        rentalSlip: include?.rentalSlip || false,
      },
    });
    return usages.map(mapToEntity);
  },

  update: async (id: string, data: Partial<Omit<ServiceUsage, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "service">>, include?: ServiceUsageInclude): Promise<ServiceUsage | null> => {
    const updateData: any = {};
    if (data.rentalSlipId !== undefined) updateData.rentalSlipId = data.rentalSlipId;
    if (data.serviceId !== undefined) updateData.serviceId = data.serviceId;
    if (data.quantity !== undefined) updateData.quantity = data.quantity;
    if (data.unitPrice !== undefined) updateData.unitPrice = data.unitPrice;
    if (data.totalAmount !== undefined) updateData.totalAmount = data.totalAmount;
    if (data.status !== undefined) updateData.status = data.status;

    const updated = await prisma.serviceUsage.update({
      where: { id },
      data: updateData,
      include: {
        service: include?.service || false,
        rentalSlip: include?.rentalSlip || false,
      },
    });
    return mapToEntity(updated);
  },

  delete: async (id: string): Promise<boolean> => {
    try {
      await prisma.serviceUsage.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },

  countAll: async (): Promise<number> => {
    return await prisma.serviceUsage.count();
  },

  generateNextCode: async (): Promise<string> => {
    const count = await prisma.serviceUsage.count();
    return `SDDV${(count + 1).toString().padStart(4, "0")}`;
  },
};

export default serviceUsagePrismaRepository;
