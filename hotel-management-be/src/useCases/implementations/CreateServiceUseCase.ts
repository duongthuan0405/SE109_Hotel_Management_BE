import { serviceRepository } from "../../repository/index.js";
import type { ICreateServiceUseCase, CreateServiceUCInput, ServiceUCOutput } from "../types/IServiceUseCases.js";

const createServiceUseCase: ICreateServiceUseCase = {
  execute: async (input: CreateServiceUCInput): Promise<ServiceUCOutput> => {
    return await serviceRepository.create({
      name: input.name,
      price: input.price,
    });
  },
};

export default createServiceUseCase;
