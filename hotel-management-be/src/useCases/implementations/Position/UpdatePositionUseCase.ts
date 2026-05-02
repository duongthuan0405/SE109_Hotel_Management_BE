import type { IUpdatePositionUseCase, UpdatePositionUCInput, PositionUCOutput } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const updatePositionUseCase: IUpdatePositionUseCase = {
  execute: async (input: UpdatePositionUCInput): Promise<PositionUCOutput | null> => {
    const existing = await positionRepository.findById(input.id);
    if (!existing) {
      throw { status: 404, message: "Chức vụ không tồn tại" };
    }

    return positionRepository.update(input.id, { name: input.name });
  },
};

export default updatePositionUseCase;
