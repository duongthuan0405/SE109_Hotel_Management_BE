import { userRepository, userProfileRepository } from "../../repository/index.js";
import { type IRegisterUseCase, type RegisterUCInput, type RegisterUCOutput } from "../types/IRegisterUseCase.js";
import { passwordService } from "../../services/index.js";
import type { User } from "../../models/User.js";

const registerUseCase: IRegisterUseCase = {
  execute: async (input: RegisterUCInput): Promise<RegisterUCOutput> => {
    const { username, password, role, fullName, identityCard, phone, email, address } = input;

    if (!username || !password || !role) {
      throw { status: 400, message: "Tên đăng nhập, mật khẩu và vai trò là bắt buộc" };
    }

    if (password.length < 6) {
      throw { status: 400, message: "Mật khẩu phải có ít nhất 6 ký tự" };
    }

    const existingUser = await userRepository.findByUsername(username);
    if (existingUser) {
      throw { status: 409, message: "Tài khoản đã tồn tại" };
    }

    const passwordHash = await passwordService.hashPassword(password);

    const userToCreate: Omit<User, "id"> = {
      username,
      passwordHash,
      role,
    };
    
    const newUser = await userRepository.create(userToCreate);

    if (role === "Customer" || email) {
      await userProfileRepository.create({
        userId: newUser.id,
        fullName: fullName || "Khách hàng mới",
        identityCard: identityCard || "CMND_" + Date.now(),
        phone: phone || "0000000000",
        email: email || username,
        address: address || "",
      });
    }

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
  },
};

export default registerUseCase;
