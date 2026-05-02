import type { ICreateServiceUsageHistoryUseCase, CreateServiceUsageHistoryUCInput, ServiceUsageHistoryUCOutput } from "../../types/IServiceUsageHistoryUseCases.js";
import { serviceUsageHistoryRepository } from "../../../repository/index.js";

const createServiceUsageHistoryUseCase: ICreateServiceUsageHistoryUseCase = {
  execute: async (input: CreateServiceUsageHistoryUCInput): Promise<ServiceUsageHistoryUCOutput> => {
    // Kiểm tra MaLSDV unique
    const existing = await serviceUsageHistoryRepository.findByCode(input.code);
    if (existing) {
      throw { status: 409, message: "Mã lịch sử sử dụng dịch vụ đã tồn tại" };
    }

    const record = await serviceUsageHistoryRepository.create({
      code: input.code,
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
