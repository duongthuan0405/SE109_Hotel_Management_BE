import type { IDeleteServiceUsageHistoryUseCase } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const deleteServiceUsageHistoryUseCase: IDeleteServiceUsageHistoryUseCase = {
  execute: async (id: string): Promise<boolean> => {
    const existing = await serviceUsageHistoryRepository.findById(id);
    if (!existing) {
      throw { status: 404, message: "Lịch sử sử dụng dịch vụ không tồn tại" };
    }
    return serviceUsageHistoryRepository.delete(id);
  },
};

export default deleteServiceUsageHistoryUseCase;
