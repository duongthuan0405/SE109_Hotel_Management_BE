import {
  type ICreateServiceUsageUseCase,
  type CreateServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const createServiceUsage: ICreateServiceUsageUseCase = {
  execute: async (input: CreateServiceUsageUCInput): Promise<ServiceUsage> => {
    // 1. Luôn tự động sinh mã SDDV từ Backend
    const count = await serviceUsageRepository.countAll();
    const code = `SDDV${String(count + 1).padStart(3, "0")}`;

    // 2. Tạo mới
    const usage = await serviceUsageRepository.create({
      code,
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
