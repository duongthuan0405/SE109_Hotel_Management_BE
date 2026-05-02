import type { ServiceUsageHistory, ServiceUsageHistoryStatus } from "../../models/ServiceUsageHistory.js";
import type { IUseCase } from "./IUseCase.js";

export type ServiceUsageHistoryUCOutput = ServiceUsageHistory;

export type IGetAllServiceUsageHistoryUseCase = IUseCase<void, ServiceUsageHistoryUCOutput[]>;

export type IGetServiceUsageHistoryByIdUseCase = IUseCase<string, ServiceUsageHistoryUCOutput | null>;

export type IGetHistoryByServiceUsageIdUseCase = IUseCase<string, ServiceUsageHistoryUCOutput[]>;

export type CreateServiceUsageHistoryUCInput = {
  code: string;
  serviceUsageId: string;
  oldStatus: ServiceUsageHistoryStatus;
  newStatus: ServiceUsageHistoryStatus;
  userId?: string | undefined;
};
export type ICreateServiceUsageHistoryUseCase = IUseCase<CreateServiceUsageHistoryUCInput, ServiceUsageHistoryUCOutput>;

export type UpdateServiceUsageHistoryUCInput = {
  id: string;
  newStatus: ServiceUsageHistoryStatus;
};
export type IUpdateServiceUsageHistoryUseCase = IUseCase<UpdateServiceUsageHistoryUCInput, ServiceUsageHistoryUCOutput | null>;

export type IDeleteServiceUsageHistoryUseCase = IUseCase<string, boolean>;
