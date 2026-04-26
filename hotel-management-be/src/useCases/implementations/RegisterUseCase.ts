import { userRepository } from "../../repository/index.js";
import { type IRegisterUseCase, type RegisterUCInput, type RegisterUCOutput } from "../types/IRegisterUseCase.js";
import { passwordService } from "../../services/index.js";
import { createCustomerUseCase } from "../index.js";
import type { User } from "../../models/User.js";

const registerUseCase: IRegisterUseCase = {
  execute: async (input: RegisterUCInput): Promise<RegisterUCOutput> => {
    const { username, password, fullName, identityCard, phone, email, address } = input;

    if (!username || !password) {
      throw { status: 400, message: "Tên đăng nhập và mật khẩu là bắt buộc" };
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
      role: "Customer",
    };
    
    const newUser = await userRepository.create(userToCreate);

    // Sử dụng CreateCustomerUseCase để tạo profile khách hàng (có MaKH)
    await createCustomerUseCase.execute({
      HoTen: fullName || "Khách hàng mới",
      CMND: identityCard || "CMND_" + Date.now(),
      SDT: phone || "0000000000",
      Email: email || username,
      DiaChi: address || "",
      TaiKhoanId: newUser.id,
    });

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
  },
};

export default registerUseCase;
