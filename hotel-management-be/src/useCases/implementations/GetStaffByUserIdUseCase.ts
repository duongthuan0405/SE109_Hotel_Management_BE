import { staffRepository } from "../../repository/index.js";
import { type IGetStaffByUserIdUseCase, type GetStaffByUserIdUCInput, type StaffUCOutput } from "../types/IStaffUseCases.js";

const getStaffByUserIdUseCase: IGetStaffByUserIdUseCase = {
  execute: async (input: GetStaffByUserIdUCInput): Promise<StaffUCOutput> => {
    const staff = await staffRepository.findByUserId(input.userId, { user: true });
    if (!staff) {
      throw { status: 404, message: "Hồ sơ nhân viên không tồn tại" };
    }
    return staff;
  },
};

export default getStaffByUserIdUseCase;
