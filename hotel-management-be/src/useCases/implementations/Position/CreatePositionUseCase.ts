import type { ICreatePositionUseCase, CreatePositionUCInput, PositionUCOutput } from "../../types/IPositionUseCases.js";
import { positionRepository } from "../../../repository/index.js";

const createPositionUseCase: ICreatePositionUseCase = {
  execute: async (input: CreatePositionUCInput): Promise<PositionUCOutput> => {
    // Kiểm tra MaChucVu unique
    const existing = await positionRepository.findByCode(input.code);
    if (existing) {
      throw { status: 409, message: "Mã chức vụ đã tồn tại" };
    }

    return positionRepository.create({
      code: input.code,
      name: input.name,
    });
  },
};

export default createPositionUseCase;
