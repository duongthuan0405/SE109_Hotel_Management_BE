import { userRepository, customerRepository } from "../../repository/index.js";

import { type IRegisterUseCase, type RegisterUCInput, type RegisterUCOutput } from "../types/IRegisterUseCase.js";
import { passwordService } from "../../services/index.js";
import createCustomerUseCase from "./CreateCustomerUseCase.js";
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

    // Kiểm tra CMND/Email trước khi tạo User để tránh tạo User rác
    if (identityCard) {
      const existingCMND = await customerRepository.findByIdentityCard(identityCard);
      if (existingCMND) {
        throw { status: 409, message: "Số CMND đã tồn tại trong hệ thống" };
      }
    }

    if (email) {
      const existingEmail = await customerRepository.findByEmail(email);
      if (existingEmail) {
        throw { status: 409, message: "Email đã tồn tại trong hệ thống" };
      }
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
      fullName: fullName || "Khách hàng mới",
      identityCard: identityCard || "CMND_" + Date.now(),
      phone: phone || "0000000000",
      email: email || username,
      address: address || "",
      userId: newUser.id,
    });

    return {
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    };
  },
};

export default registerUseCase;
