import { staffRepository } from "../../repository/index.js";
import { type IGetStaffByIdUseCase, type GetStaffByIdUCInput, type StaffUCOutput } from "../types/IStaffUseCases.js";

const getStaffByIdUseCase: IGetStaffByIdUseCase = {
  execute: async (input: GetStaffByIdUCInput): Promise<StaffUCOutput> => {
    const staff = await staffRepository.findById(input.id, { user: true });
    if (!staff) {
      throw { status: 404, message: "Nhân viên không tồn tại" };
    }
    return staff;
  },
};

export default getStaffByIdUseCase;
