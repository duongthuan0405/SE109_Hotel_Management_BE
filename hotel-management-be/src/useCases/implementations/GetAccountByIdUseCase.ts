import { userRepository } from "../../repository/index.js";
import { type IGetAccountByIdUseCase, type GetAccountByIdUCInput, type AccountUCOutput } from "../types/IAccountUseCases.js";

const getAccountByIdUseCase: IGetAccountByIdUseCase = {
  execute: async (input: GetAccountByIdUCInput): Promise<AccountUCOutput> => {
    const user = await userRepository.findById(input.id);
    if (!user) {
      throw { status: 404, message: "Tài khoản không tồn tại" };
    }
    const { passwordHash, ...rest } = user;
    return rest;
  },
};

export default getAccountByIdUseCase;
