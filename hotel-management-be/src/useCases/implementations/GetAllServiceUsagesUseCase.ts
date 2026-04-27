import { type IGetAllServiceUsagesUseCase } from "../types/IServiceUsageUseCases.js";
import { type ServiceUsage } from "../../models/ServiceUsage.js";
import { serviceUsageRepository } from "../../repository/index.js";

export const getAllServiceUsages: IGetAllServiceUsagesUseCase = {
  execute: async (): Promise<ServiceUsage[]> => {
    return serviceUsageRepository.findAll({
      rentalSlip: true,
      service: true,
    });
  },
};
