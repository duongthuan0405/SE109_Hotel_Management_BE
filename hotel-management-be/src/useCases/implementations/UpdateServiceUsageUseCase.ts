import {
  type IUpdateServiceUsageUseCase,
  type UpdateServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const updateServiceUsage: IUpdateServiceUsageUseCase = {
  execute: async (input: UpdateServiceUsageUCInput): Promise<ServiceUsage> => {
    const existing = await serviceUsageRepository.findById(input.id);
    if (!existing) {
      throw { status: 404, message: "Sử dụng dịch vụ không tồn tại" };
    }

    const updateData: Record<string, any> = {};
    if (input.quantity !== undefined) {
      updateData.quantity = input.quantity;
      updateData.totalAmount = input.quantity * existing.unitPrice;
    }
    if (input.status !== undefined) updateData.status = input.status;

    const updated = await serviceUsageRepository.update(input.id, updateData, {
      rentalSlip: true,
      service: true,
    });

    return updated!;
  },
};
