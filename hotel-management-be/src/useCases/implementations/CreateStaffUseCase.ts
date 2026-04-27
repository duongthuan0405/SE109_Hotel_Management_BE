import { staffRepository } from "../../repository/index.js";
import { type ICreateStaffUseCase, type CreateStaffUCInput, type StaffUCOutput } from "../types/IStaffUseCases.js";

const createStaffUseCase: ICreateStaffUseCase = {
  execute: async (input: CreateStaffUCInput): Promise<StaffUCOutput> => {
    const { userId, fullName, position, phone, email } = input;

    // Kiểm tra Email tồn tại
    const existingEmail = await staffRepository.findByEmail(email);
    if (existingEmail) {
      throw { status: 409, message: "Email nhân viên đã tồn tại" };
    }

    // Sinh MaNV mới
    const MaNV = await staffRepository.generateNextId();

    const newStaff = await staffRepository.create({
      userId,
      staffId: MaNV,
      fullName,
      position,
      phone,
      email,
    });

    const populatedStaff = await staffRepository.findById(newStaff.id, { user: true });

    return populatedStaff!;
  },
};

export default createStaffUseCase;
