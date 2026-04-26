import { staffRepository } from "../../repository/index.js";
import { type IDeleteStaffUseCase } from "../types/IStaffUseCases.js";

const deleteStaffUseCase: IDeleteStaffUseCase = {
  execute: async (input: { id: string }): Promise<void> => {
    const success = await staffRepository.delete(input.id);
    if (!success) {
      throw { status: 404, message: "Nhân viên không tồn tại" };
    }
  },
};

export default deleteStaffUseCase;
