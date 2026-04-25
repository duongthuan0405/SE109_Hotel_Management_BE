import { userRepository } from "@/repository/index.js";
import { type ILoginUseCase, type LoginUCInput, type LoginUCOutput } from "@/useCases/types/ILoginUseCase.js";
import { passwordService, jwtService } from "@/services/index.js";

const loginUseCase: ILoginUseCase = {
  execute: async (input: LoginUCInput): Promise<LoginUCOutput> => {
    const { username, password } = input;

    if (!username || !password) {
      throw { status: 400, message: "Tên đăng nhập và mật khẩu là bắt buộc" };
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      throw { status: 401, message: "Tên đăng nhập hoặc mật khẩu không chính xác" };
    }

    const isValid = await passwordService.verifyPassword(password, user.passwordHash);
    if (!isValid) {
      throw { status: 401, message: "Tên đăng nhập hoặc mật khẩu không chính xác" };
    }

    const token = await jwtService.generateToken({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    return {
      token,
      role: user.role,
    };
  },
};

export default loginUseCase;
