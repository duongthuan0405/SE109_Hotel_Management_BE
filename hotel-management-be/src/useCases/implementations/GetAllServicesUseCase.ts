import { serviceRepository } from "../../repository/index.js";
import type { IGetAllServicesUseCase, ServiceUCOutput } from "../types/IServiceUseCases.js";

const getAllServicesUseCase: IGetAllServicesUseCase = {
  execute: async (): Promise<ServiceUCOutput[]> => {
    return await serviceRepository.findAll();
  },
};

export default getAllServicesUseCase;
