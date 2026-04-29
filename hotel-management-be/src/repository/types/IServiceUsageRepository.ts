import { type ServiceUsage } from "../../models/ServiceUsage.js";

export type ServiceUsageInclude = {
  rentalSlip?: boolean;
  service?: boolean;
};

export interface IServiceUsageRepository {
  create(data: Omit<ServiceUsage, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "service" | "code"> & { code?: string | undefined }): Promise<ServiceUsage>;
  findById(id: string, include?: ServiceUsageInclude): Promise<ServiceUsage | null>;
  findByCode(code: string): Promise<ServiceUsage | null>;
  findAll(include?: ServiceUsageInclude): Promise<ServiceUsage[]>;
  findByRentalSlipIds(ids: string[], include?: ServiceUsageInclude): Promise<ServiceUsage[]>;
  findByCustomerId(customerId: string, include?: ServiceUsageInclude): Promise<ServiceUsage[]>;
  update(id: string, data: Partial<Omit<ServiceUsage, "id" | "createdAt" | "updatedAt" | "rentalSlip" | "service">>, include?: ServiceUsageInclude): Promise<ServiceUsage | null>;
  delete(id: string): Promise<boolean>;
  countAll(): Promise<number>;
  generateNextCode(): Promise<string>;
}
