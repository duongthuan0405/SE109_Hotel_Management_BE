import {
  type IDeleteServiceUsageUseCase,
  type DeleteServiceUsageUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const deleteServiceUsage: IDeleteServiceUsageUseCase = {
  execute: async (input: DeleteServiceUsageUCInput): Promise<ServiceUsage> => {
    const existing = await serviceUsageRepository.findById(input.id, {
      rentalSlip: true,
      service: true,
    });

    if (!existing) {
      throw { status: 404, message: "Sử dụng dịch vụ không tồn tại" };
    }

    await serviceUsageRepository.delete(input.id);
    return existing;
  },
};
