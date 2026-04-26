import { staffRepository } from "../../repository/index.js";
import { type IUpdateStaffUseCase, type UpdateStaffUCInput, type StaffUCOutput } from "../types/IStaffUseCases.js";

const updateStaffUseCase: IUpdateStaffUseCase = {
  execute: async (input: UpdateStaffUCInput): Promise<StaffUCOutput> => {
    const { id, ...data } = input;

    const existingStaff = await staffRepository.findById(id);
    if (!existingStaff) {
      throw { status: 404, message: "Nhân viên không tồn tại" };
    }

    const updatedStaff = await staffRepository.update(id, {
      fullName: data.HoTen as string,
      position: data.ChucVu as string,
      phone: data.SDT as string,
      email: data.Email as string,
    });

    if (!updatedStaff) {
      throw { status: 500, message: "Lỗi khi cập nhật nhân viên" };
    }

    return updatedStaff;
  },
};

export default updateStaffUseCase;
