import { serviceRepository } from "../../repository/index.js";
import type { IUpdateServiceUseCase, UpdateServiceUCInput, ServiceUCOutput } from "../types/IServiceUseCases.js";

const updateServiceUseCase: IUpdateServiceUseCase = {
  execute: async (input: UpdateServiceUCInput): Promise<ServiceUCOutput> => {
    const service = await serviceRepository.findById(input.id);
    if (!service) {
      throw { status: 404, message: "Dịch vụ không tồn tại" };
    }

    if (input.name !== undefined) service.name = input.name;
    if (input.price !== undefined) service.price = input.price;

    return await serviceRepository.save(service);
  },
};

export default updateServiceUseCase;
