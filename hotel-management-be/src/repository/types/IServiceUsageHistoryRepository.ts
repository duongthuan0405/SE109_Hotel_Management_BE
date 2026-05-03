import type { ServiceUsageHistory } from "../../models/ServiceUsageHistory.js";

export type ServiceUsageHistoryInclude = {
  serviceUsage?: boolean;
  user?: boolean;
};

export interface IServiceUsageHistoryRepository {
  findAll(include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory[]>;
  findById(id: string, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory | null>;
  findByServiceUsageId(serviceUsageId: string, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory[]>;
  findByCode(code: string): Promise<ServiceUsageHistory | null>;
  create(data: Omit<ServiceUsageHistory, 'id' | 'createdAt' | 'updatedAt' | 'serviceUsage' | 'user'>): Promise<ServiceUsageHistory>;
  update(id: string, data: Partial<Omit<ServiceUsageHistory, 'id' | 'code' | 'createdAt' | 'updatedAt' | 'serviceUsage' | 'user'>>, include?: ServiceUsageHistoryInclude): Promise<ServiceUsageHistory | null>;
  delete(id: string): Promise<boolean>;
}
