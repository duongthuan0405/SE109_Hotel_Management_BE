import type { IGetAllPositionsUseCase, PositionUCOutput } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const getAllPositionsUseCase: IGetAllPositionsUseCase = {
  execute: async (): Promise<PositionUCOutput[]> => {
    return positionRepository.findAll();
  },
};

export default getAllPositionsUseCase;
