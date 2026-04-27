import { type IUseCase } from "./IUseCase.js";
import { type ServiceUsage, type ServiceUsageStatus } from "../../models/ServiceUsage.js";

// Create
export type CreateServiceUsageUCInput = {
  code?: string | undefined;
  rentalSlipId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  requestedAt?: Date | undefined;
};
export type ICreateServiceUsageUseCase = IUseCase<CreateServiceUsageUCInput, ServiceUsage>;

// Get All
export type IGetAllServiceUsagesUseCase = IUseCase<{}, ServiceUsage[]>;

// Get By ID
export type GetServiceUsageByIdUCInput = { id: string };
export type IGetServiceUsageByIdUseCase = IUseCase<GetServiceUsageByIdUCInput, ServiceUsage>;

// Get By Customer ID
export type GetServiceUsagesByCustomerIdUCInput = { customerId: string };
export type IGetServiceUsagesByCustomerIdUseCase = IUseCase<GetServiceUsagesByCustomerIdUCInput, ServiceUsage[]>;

// Update
export type UpdateServiceUsageUCInput = {
  id: string;
  quantity?: number | undefined;
  status?: ServiceUsageStatus | undefined;
};
export type IUpdateServiceUsageUseCase = IUseCase<UpdateServiceUsageUCInput, ServiceUsage>;

// Delete
export type DeleteServiceUsageUCInput = { id: string };
export type IDeleteServiceUsageUseCase = IUseCase<DeleteServiceUsageUCInput, ServiceUsage>;
