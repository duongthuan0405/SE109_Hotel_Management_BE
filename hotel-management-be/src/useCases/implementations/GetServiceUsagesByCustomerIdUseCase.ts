import {
  type IGetServiceUsagesByCustomerIdUseCase,
  type GetServiceUsagesByCustomerIdUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const getServiceUsagesByCustomerId: IGetServiceUsagesByCustomerIdUseCase = {
  execute: async (input: GetServiceUsagesByCustomerIdUCInput): Promise<ServiceUsage[]> => {
    if (!input.customerId) {
      throw { status: 400, message: "Thiếu ID khách hàng" };
    }

    return serviceUsageRepository.findByCustomerId(input.customerId, {
      rentalSlip: true,
      service: true,
    });
  },
};
