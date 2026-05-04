import type { IGetHistoryByServiceUsageIdUseCase, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const getHistoryByServiceUsageIdUseCase: IGetHistoryByServiceUsageIdUseCase = {
  execute: async (serviceUsageId: string): Promise<ServiceUsageHistoryUCOutput[]> => {
    return serviceUsageHistoryRepository.findByServiceUsageId(serviceUsageId, { serviceUsage: true, user: true });
  },
};

export default getHistoryByServiceUsageIdUseCase;
