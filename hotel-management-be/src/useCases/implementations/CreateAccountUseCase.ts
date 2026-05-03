import { unitOfWork, userRepository } from "../../repository/index.js";
import { passwordService } from "../../services/index.js";
import { type ICreateAccountUseCase, type CreateAccountUCInput, type AccountUCOutput } from "../types/IAccountUseCases.js";
import createStaffUseCase from "./CreateStaffUseCase.js";

const createAccountUseCase: ICreateAccountUseCase = {
  execute: async (input: CreateAccountUCInput): Promise<AccountUCOutput> => {
    return await unitOfWork.runInTransaction(async () => {
      const { username, password, role } = input;

      if (!username || !password || !role) {
        throw { status: 400, message: "Vui lòng cung cấp tên đăng nhập, mật khẩu và vai trò" };
      }

      if (password.length < 6) {
        throw { status: 400, message: "Mật khẩu phải có ít nhất 6 ký tự" };
      }

      const existingUser = await userRepository.findByUsername(username);
      if (existingUser) {
        throw { status: 409, message: "Tên đăng nhập đã tồn tại" };
      }

      const passwordHash = await passwordService.hashPassword(password);
      const newUser = await userRepository.create({
        username,
        passwordHash,
        role,
      });

      // Nếu không phải khách hàng, tự động tạo hồ sơ nhân viên (Staff)
      if (role !== "Customer") {
        await createStaffUseCase.execute({
          userId: newUser.id,
          fullName: username,
          position: role,
          phone: "",
          email: ""
        });
      }

      const { passwordHash: _, ...rest } = newUser;
      return rest;
    });
  },
};

export default createAccountUseCase;

