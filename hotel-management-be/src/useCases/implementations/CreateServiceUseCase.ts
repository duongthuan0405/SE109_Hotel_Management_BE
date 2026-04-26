import { serviceRepository } from "../../repository/index.js";
import type { ICreateServiceUseCase, CreateServiceUCInput, ServiceUCOutput } from "../types/IServiceUseCases.js";

const createServiceUseCase: ICreateServiceUseCase = {
  execute: async (input: CreateServiceUCInput): Promise<ServiceUCOutput> => {
    const existing = await serviceRepository.findByCode(input.code);
    if (existing) {
      throw { status: 400, message: "Mã dịch vụ đã tồn tại" };
    }

    return await serviceRepository.create({
      code: input.code,
      name: input.name,
      price: input.price,
    });
  },
};

export default createServiceUseCase;
