import { serviceRepository } from "../../repository/index.js";
import type { IDeleteServiceUseCase } from "../types/IServiceUseCases.js";

const deleteServiceUseCase: IDeleteServiceUseCase = {
  execute: async (input: { id: string }): Promise<boolean> => {
    const service = await serviceRepository.findById(input.id);
    if (!service) {
      throw { status: 404, message: "Dịch vụ không tồn tại" };
    }

    return await serviceRepository.deleteById(input.id);
  },
};

export default deleteServiceUseCase;
