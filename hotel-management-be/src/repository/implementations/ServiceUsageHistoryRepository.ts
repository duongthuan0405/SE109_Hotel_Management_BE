import { type IServiceUsageHistoryRepository, type ServiceUsageHistoryInclude } from "../types/IServiceUsageHistoryRepository.js";
import { type ServiceUsageHistory } from "../../models/ServiceUsageHistory.js";
import crypto from "crypto";
import serviceUsageRepository from "./ServiceUsageRepository.js";
import userRepository from "./UserRepository.js";

let records: ServiceUsageHistory[] = [
  {
    id: "suh-1",
    code: "LSDV001",
    serviceUsageId: "su-1",
    oldStatus: "Pending",
    newStatus: "In Progress",
    changedAt: new Date("2026-04-28"),
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "suh-2",
    code: "LSDV002",
    serviceUsageId: "su-1",
    oldStatus: "In Progress",
    newStatus: "Completed",
    changedAt: new Date("2026-04-29"),
    userId: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const applyInclude = async (record: ServiceUsageHistory, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory> => {
  if (!include) return { ...record };

  const result = { ...record };

  if (include.serviceUsage) {
    result.serviceUsage = (await serviceUsageRepository.findById(record.serviceUsageId)) || undefined;
  }

  if (include.user && record.userId) {
    result.user = (await userRepository.findById(record.userId)) || undefined;
  }

  return result;
};

const serviceUsageHistoryRepository: IServiceUsageHistoryRepository = {
  findAll: async (include): Promise<ServiceUsageHistory[]> => {
    return Promise.all(records.map((r) => applyInclude(r, include)));
  },

  findById: async (id, include): Promise<ServiceUsageHistory | null> => {
    const record = records.find((r) => r.id === id);
    if (!record) return null;
    return applyInclude(record, include);
  },

  findByServiceUsageId: async (serviceUsageId, include): Promise<ServiceUsageHistory[]> => {
    const filtered = records.filter((r) => r.serviceUsageId === serviceUsageId);
    // Sort by changedAt desc
    filtered.sort((a, b) => b.changedAt.getTime() - a.changedAt.getTime());
    return Promise.all(filtered.map((r) => applyInclude(r, include)));
  },

  findByCode: async (code): Promise<ServiceUsageHistory | null> => {
    return records.find((r) => r.code === code) || null;
  },

  create: async (data): Promise<ServiceUsageHistory> => {
    const newRecord: ServiceUsageHistory = {
      id: crypto.randomUUID(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    records.push(newRecord);
    return { ...newRecord };
  },

  update: async (id, data, include): Promise<ServiceUsageHistory | null> => {
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const current = records[index]!;
    const updated: ServiceUsageHistory = {
      ...current,
      ...data,
      updatedAt: new Date(),
    } as ServiceUsageHistory;

    records[index] = updated;
    return applyInclude(updated, include);
  },

  delete: async (id): Promise<boolean> => {
    const initialLength = records.length;
    records = records.filter((r) => r.id !== id);
    return records.length < initialLength;
  },
};

export default serviceUsageHistoryRepository;
