import {
  type IUpdateServiceUsageUseCase,
  type UpdateServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const updateServiceUsage: IUpdateServiceUsageUseCase = {
  execute: async (input: UpdateServiceUsageUCInput): Promise<ServiceUsage> => {
    const updateData: Record<string, any> = {};
    if (input.quantity !== undefined) updateData.quantity = input.quantity;
    if (input.status !== undefined) updateData.status = input.status;

    const updated = await serviceUsageRepository.update(input.id, updateData, {
      rentalSlip: true,
      service: true,
    });

    if (!updated) {
      throw { status: 404, message: "Sử dụng dịch vụ không tồn tại" };
    }

    return updated;
  },
};
