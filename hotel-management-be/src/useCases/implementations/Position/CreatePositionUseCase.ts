import type { ICreatePositionUseCase, CreatePositionUCInput, PositionUCOutput } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const createPositionUseCase: ICreatePositionUseCase = {
  execute: async (input: CreatePositionUCInput): Promise<PositionUCOutput> => {
    return positionRepository.create({
      name: input.name,
    } as any); // Cast as any because the Repo Omit still includes code, but we want it auto-gen
  },
};

export default createPositionUseCase;
