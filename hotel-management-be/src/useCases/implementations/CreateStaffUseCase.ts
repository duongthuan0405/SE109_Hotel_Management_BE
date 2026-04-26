import { staffRepository } from "../../repository/index.js";
import { type ICreateStaffUseCase, type CreateStaffUCInput, type StaffUCOutput } from "../types/IStaffUseCases.js";

const createStaffUseCase: ICreateStaffUseCase = {
  execute: async (input: CreateStaffUCInput): Promise<StaffUCOutput> => {
    const { TaiKhoanId, HoTen, ChucVu, SDT, Email } = input;

    // Kiểm tra Email tồn tại
    const existingEmail = await staffRepository.findByEmail(Email);
    if (existingEmail) {
      throw { status: 409, message: "Email nhân viên đã tồn tại" };
    }

    // Sinh MaNV mới
    const MaNV = await staffRepository.generateNextId();

    const newStaff = await staffRepository.create({
      userId: TaiKhoanId,
      staffId: MaNV,
      fullName: HoTen,
      position: ChucVu,
      phone: SDT,
      email: Email,
    });

    return newStaff;
  },
};

export default createStaffUseCase;
