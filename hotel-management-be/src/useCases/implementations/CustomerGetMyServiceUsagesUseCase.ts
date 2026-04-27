import {
  type ICustomerGetMyServiceUsagesUseCase,
  type CustomerGetMyServiceUsagesUCInput,
} from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository, customerRepository } from "../../repository/index.js";

export const customerGetMyServiceUsages: ICustomerGetMyServiceUsagesUseCase = {
  execute: async (input: CustomerGetMyServiceUsagesUCInput): Promise<ServiceUsage[]> => {
    const customer = await customerRepository.findByUserId(input.userId);
    if (!customer) {
      throw { status: 404, message: "Không tìm thấy thông tin khách hàng" };
    }

    return serviceUsageRepository.findByCustomerId(customer.id, {
      rentalSlip: true,
      service: true,
    });
  },
};
