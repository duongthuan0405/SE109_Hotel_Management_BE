import {
  type ICreateServiceUsageUseCase,
  type CreateServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository, staffRepository } from "../../repository/index.js";

export const createServiceUsage: ICreateServiceUsageUseCase = {
  execute: async (input: CreateServiceUsageUCInput): Promise<ServiceUsage> => {
    // 1. Kiểm tra tính hợp lệ của Nhân viên thực hiện
    if (input.executorUserId) {
      const staff = await staffRepository.findByUserId(input.executorUserId);
      if (!staff) {
        throw { status: 403, message: "Nhân viên thực hiện không tồn tại trong hệ thống" };
      }
    }

    // 2. Tạo mới (Mã SDDV được Repo tự sinh)
    const usage = await serviceUsageRepository.create({
      rentalSlipId: input.rentalSlipId,
      serviceId: input.serviceId,
      quantity: input.quantity,
      unitPrice: input.unitPrice,
      totalAmount: input.quantity * input.unitPrice,
      requestedAt: input.requestedAt || new Date(),
      status: "Completed",
    });

    // 4. Trả về với populated data
    const populated = await serviceUsageRepository.findById(usage.id, {
      rentalSlip: true,
      service: true,
    });

    return populated!;
  },
};
