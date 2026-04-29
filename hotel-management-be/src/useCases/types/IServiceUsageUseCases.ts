import { type IUseCase } from "./IUseCase.js";
import { type ServiceUsage, type ServiceUsageStatus } from "../../models/ServiceUsage.js";

// Create
export type CreateServiceUsageUCInput = {
  rentalSlipId: string;
  serviceId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  requestedAt?: Date | undefined;
  executorUserId?: string | undefined;
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

// Get My Service Usages (Customer)
export type CustomerGetMyServiceUsagesUCInput = { userId: string };
export type ICustomerGetMyServiceUsagesUseCase = IUseCase<CustomerGetMyServiceUsagesUCInput, ServiceUsage[]>;

// Order Service (Customer)
export type CustomerOrderServiceUCInput = {
  userId: string;
  rentalSlipId: string;
  serviceId: string;
  quantity: number;
};
export type ICustomerOrderServiceUseCase = IUseCase<CustomerOrderServiceUCInput, ServiceUsage>;

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
