import { userRepository } from "../../repository/index.js";
import { type IUpdateAccountUseCase, type UpdateAccountUCInput, type AccountUCOutput } from "../types/IAccountUseCases.js";

const updateAccountUseCase: IUpdateAccountUseCase = {
  execute: async (input: UpdateAccountUCInput): Promise<AccountUCOutput> => {
    const { id, role } = input;

    const user = await userRepository.findById(id);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }

    if (role) {
      user.role = role;
    }

    await userRepository.save(user);

    const { passwordHash: _, ...rest } = user;
    return rest;
  },
};

export default updateAccountUseCase;
