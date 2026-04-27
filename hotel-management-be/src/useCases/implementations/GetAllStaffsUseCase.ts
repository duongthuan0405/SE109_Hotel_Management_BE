import { staffRepository } from "../../repository/index.js";
import { type IGetAllStaffsUseCase, type StaffUCOutput } from "../types/IStaffUseCases.js";

const getAllStaffsUseCase: IGetAllStaffsUseCase = {
  execute: async (): Promise<StaffUCOutput[]> => {
    return await staffRepository.findAll({ user: true });
  },
};

export default getAllStaffsUseCase;
