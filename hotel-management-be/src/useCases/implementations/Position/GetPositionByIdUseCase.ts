import type { IGetPositionByIdUseCase, PositionUCOutput } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const getPositionByIdUseCase: IGetPositionByIdUseCase = {
  execute: async (id: string): Promise<PositionUCOutput | null> => {
    return positionRepository.findById(id);
  },
};

export default getPositionByIdUseCase;
