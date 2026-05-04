import type { IDeletePositionUseCase } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const deletePositionUseCase: IDeletePositionUseCase = {
  execute: async (id: string): Promise<boolean> => {
    const existing = await positionRepository.findById(id);
    if (!existing) {
      throw { status: 404, message: "Chức vụ không tồn tại" };
    }

    return positionRepository.delete(id);
  },
};

export default deletePositionUseCase;
