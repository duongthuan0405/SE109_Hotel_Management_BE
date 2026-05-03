import { type IServiceUsageRepository, type ServiceUsageInclude } from "../../types/IServiceUsageRepository.js";
import { type ServiceUsage } from "../../../models/ServiceUsage.js";
import crypto from "crypto";
import rentalReceiptRepository from "./RentalReceiptRepository.js";
import serviceRepository from "./ServiceRepository.js";
import bookingRepository from "./BookingRepository.js";

let serviceUsages: ServiceUsage[] = [];

const applyInclude = async (usage: ServiceUsage, include?: ServiceUsageInclude): Promise<ServiceUsage> => {
  if (!include) return { ...usage };

  const result = { ...usage };

  if (include.rentalSlip) {
    result.rentalSlip = (await rentalReceiptRepository.findById(usage.rentalSlipId)) || undefined;
  }
  if (include.service) {
    result.service = (await serviceRepository.findById(usage.serviceId)) || undefined;
  }

  return result;
};

const serviceUsageRepository: IServiceUsageRepository = {
  create: async (data: Omit<ServiceUsage, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "service" | "code"> & { code?: string | undefined }): Promise<ServiceUsage> => {
    const code = data.code || (await serviceUsageRepository.generateNextCode());
    const newUsage: ServiceUsage = {
      id: crypto.randomUUID(),
      ...data,
      code,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    serviceUsages.push(newUsage);
    return { ...newUsage };
  },

  findById: async (id, include): Promise<ServiceUsage | null> => {
    const usage = serviceUsages.find((u) => u.id === id);
    if (!usage) return null;
    return applyInclude(usage, include);
  },

  findByCode: async (code): Promise<ServiceUsage | null> => {
    const usage = serviceUsages.find((u) => u.code === code);
    if (!usage) return null;
    return { ...usage };
  },

  findAll: async (include): Promise<ServiceUsage[]> => {
    return Promise.all(serviceUsages.map((u) => applyInclude(u, include)));
  },

  findByRentalSlipIds: async (ids, include): Promise<ServiceUsage[]> => {
    const filtered = serviceUsages.filter((u) => ids.includes(u.rentalSlipId));
    return Promise.all(filtered.map((u) => applyInclude(u, include)));
  },

  findByCustomerId: async (customerId, include): Promise<ServiceUsage[]> => {
    // Chain lookup: customer → bookings → rentalSlips → serviceUsages
    const bookings = await bookingRepository.findByCustomerId(customerId);
    const bookingIds = bookings.map((b) => b.id);

    const allSlips = await rentalReceiptRepository.findAll();
    const slipIds = allSlips
      .filter((s) => bookingIds.includes(s.bookingId))
      .map((s) => s.id);

    if (slipIds.length === 0) return [];

    const filtered = serviceUsages.filter((u) => slipIds.includes(u.rentalSlipId));
    const sorted = filtered.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    return Promise.all(sorted.map((u) => applyInclude(u, include)));
  },

  update: async (id, data, include): Promise<ServiceUsage | null> => {
    const index = serviceUsages.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const usage = serviceUsages[index]!;
    const updatedUsage: ServiceUsage = {
      ...usage,
      ...data,
      updatedAt: new Date(),
    } as ServiceUsage;

    serviceUsages[index] = updatedUsage;
    return applyInclude(updatedUsage, include);
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = serviceUsages.length;
    serviceUsages = serviceUsages.filter((u) => u.id !== id);
    return serviceUsages.length < initialLength;
  },

  countAll: async (): Promise<number> => {
    return serviceUsages.length;
  },
  generateNextCode: async (): Promise<string> => {
    const nextId = serviceUsages.length + 1;
    return `SDDV${String(nextId).padStart(3, "0")}`;
  },
};

export default serviceUsageRepository;
