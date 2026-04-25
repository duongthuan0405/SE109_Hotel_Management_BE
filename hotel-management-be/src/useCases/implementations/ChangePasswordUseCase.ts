import { userRepository } from "../../repository/index.js";
import { passwordService } from "../../services/index.js";
import { type IChangePasswordUseCase, type ChangePasswordUCInput } from "../types/IAccountUseCases.js";

const changePasswordUseCase: IChangePasswordUseCase = {
  execute: async (input: ChangePasswordUCInput): Promise<void> => {
    const { id, oldPassword, newPassword } = input;

    if (!oldPassword || !newPassword) {
      throw { status: 400, message: "Vui lòng cung cấp mật khẩu cũ và mới" };
    }

    if (newPassword.length < 6) {
      throw { status: 400, message: "Mật khẩu mới phải có ít nhất 6 ký tự" };
    }

    const user = await userRepository.findById(id);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }

    const isPasswordCorrect = await passwordService.verifyPassword(oldPassword, user.passwordHash);
    if (!isPasswordCorrect) {
      throw { status: 401, message: "Mật khẩu cũ không chính xác" };
    }

    user.passwordHash = await passwordService.hashPassword(newPassword);
    await userRepository.save(user);
  },
};

export default changePasswordUseCase;
