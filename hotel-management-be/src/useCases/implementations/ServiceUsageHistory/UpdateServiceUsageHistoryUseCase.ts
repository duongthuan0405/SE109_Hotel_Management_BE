import type { IUpdateServiceUsageHistoryUseCase, UpdateServiceUsageHistoryUCInput, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const updateServiceUsageHistoryUseCase: IUpdateServiceUsageHistoryUseCase = {
  execute: async (input: UpdateServiceUsageHistoryUCInput): Promise<ServiceUsageHistoryUCOutput | null> => {
    const existing = await serviceUsageHistoryRepository.findById(input.id);
    if (!existing) {
      throw { status: 404, message: "Lịch sử sử dụng dịch vụ không tồn tại" };
    }

    // Legacy logic: TrangThaiCu = old TrangThaiMoi, TrangThaiMoi = new value
    return serviceUsageHistoryRepository.update(
      input.id,
      {
        oldStatus: existing.newStatus,
        newStatus: input.newStatus,
      },
      { serviceUsage: true, user: true }
    );
  },
};

export default updateServiceUsageHistoryUseCase;
