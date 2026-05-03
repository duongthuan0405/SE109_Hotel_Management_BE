import type { IGetAllServiceUsageHistoryUseCase, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const getAllServiceUsageHistoryUseCase: IGetAllServiceUsageHistoryUseCase = {
  execute: async (): Promise<ServiceUsageHistoryUCOutput[]> => {
    return serviceUsageHistoryRepository.findAll({ serviceUsage: true, user: true });
  },
};

export default getAllServiceUsageHistoryUseCase;
