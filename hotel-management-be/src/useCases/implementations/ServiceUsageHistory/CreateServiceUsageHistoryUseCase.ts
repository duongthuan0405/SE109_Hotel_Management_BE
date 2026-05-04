import type { ICreateServiceUsageHistoryUseCase, CreateServiceUsageHistoryUCInput, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const createServiceUsageHistoryUseCase: ICreateServiceUsageHistoryUseCase = {
  execute: async (input: CreateServiceUsageHistoryUCInput): Promise<ServiceUsageHistoryUCOutput> => {
    const record = await serviceUsageHistoryRepository.create({
      serviceUsageId: input.serviceUsageId,
      oldStatus: input.oldStatus,
      newStatus: input.newStatus,
      changedAt: new Date(),
      userId: input.userId,
    });

    return serviceUsageHistoryRepository.findById(record.id, { serviceUsage: true, user: true }) as Promise<ServiceUsageHistoryUCOutput>;
  },
};

export default createServiceUsageHistoryUseCase;
