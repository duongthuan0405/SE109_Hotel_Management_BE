import type { IGetServiceUsageHistoryByIdUseCase, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const getServiceUsageHistoryByIdUseCase: IGetServiceUsageHistoryByIdUseCase = {
  execute: async (id: string): Promise<ServiceUsageHistoryUCOutput | null> => {
    return serviceUsageHistoryRepository.findById(id, { serviceUsage: true, user: true });
  },
};

export default getServiceUsageHistoryByIdUseCase;
