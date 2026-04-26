import { serviceRepository } from "../../repository/index.js";
import type { IGetServiceByIdUseCase, ServiceUCOutput } from "../types/IServiceUseCases.js";

const getServiceByIdUseCase: IGetServiceByIdUseCase = {
  execute: async (input: { id: string }): Promise<ServiceUCOutput> => {
    const service = await serviceRepository.findById(input.id);
    if (!service) {
      throw { status: 404, message: "Dịch vụ không tồn tại" };
    }
    return service;
  },
};

export default getServiceByIdUseCase;
