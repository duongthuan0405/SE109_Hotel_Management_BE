import {
  type IGetServiceUsageByIdUseCase,
  type GetServiceUsageByIdUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const getServiceUsageById: IGetServiceUsageByIdUseCase = {
  execute: async (input: GetServiceUsageByIdUCInput): Promise<ServiceUsage> => {
    const usage = await serviceUsageRepository.findById(input.id, {
      rentalSlip: true,
      service: true,
    });

    if (!usage) {
      throw { status: 404, message: "Sử dụng dịch vụ không tồn tại" };
    }

    return usage;
  },
};
